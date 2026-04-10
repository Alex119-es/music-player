import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPlaylistSong, NewPlaylistSong } from '../playlist-song.model';

export type PartialUpdatePlaylistSong = Partial<IPlaylistSong> & Pick<IPlaylistSong, 'id'>;

type RestOf<T extends IPlaylistSong | NewPlaylistSong> = Omit<T, 'addedAt'> & {
  addedAt?: string | null;
};

export type RestPlaylistSong = RestOf<IPlaylistSong>;

export type NewRestPlaylistSong = RestOf<NewPlaylistSong>;

export type PartialUpdateRestPlaylistSong = RestOf<PartialUpdatePlaylistSong>;

@Injectable()
export class PlaylistSongsService {
  readonly playlistSongsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly playlistSongsResource = httpResource<RestPlaylistSong[]>(() => {
    const params = this.playlistSongsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of playlistSong that have been fetched. It is updated when the playlistSongsResource emits a new value.
   * In case of error while fetching the playlistSongs, the signal is set to an empty array.
   */
  readonly playlistSongs = computed(() =>
    (this.playlistSongsResource.hasValue() ? this.playlistSongsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/playlist-songs');

  protected convertValueFromServer(restPlaylistSong: RestPlaylistSong): IPlaylistSong {
    return {
      ...restPlaylistSong,
      addedAt: restPlaylistSong.addedAt ? dayjs(restPlaylistSong.addedAt) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class PlaylistSongService extends PlaylistSongsService {
  protected readonly http = inject(HttpClient);

  create(playlistSong: NewPlaylistSong): Observable<IPlaylistSong> {
    const copy = this.convertValueFromClient(playlistSong);
    return this.http.post<RestPlaylistSong>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(playlistSong: IPlaylistSong): Observable<IPlaylistSong> {
    const copy = this.convertValueFromClient(playlistSong);
    return this.http
      .put<RestPlaylistSong>(`${this.resourceUrl}/${encodeURIComponent(this.getPlaylistSongIdentifier(playlistSong))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(playlistSong: PartialUpdatePlaylistSong): Observable<IPlaylistSong> {
    const copy = this.convertValueFromClient(playlistSong);
    return this.http
      .patch<RestPlaylistSong>(`${this.resourceUrl}/${encodeURIComponent(this.getPlaylistSongIdentifier(playlistSong))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IPlaylistSong> {
    return this.http
      .get<RestPlaylistSong>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IPlaylistSong[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPlaylistSong[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPlaylistSongIdentifier(playlistSong: Pick<IPlaylistSong, 'id'>): number {
    return playlistSong.id;
  }

  comparePlaylistSong(o1: Pick<IPlaylistSong, 'id'> | null, o2: Pick<IPlaylistSong, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlaylistSongIdentifier(o1) === this.getPlaylistSongIdentifier(o2) : o1 === o2;
  }

  addPlaylistSongToCollectionIfMissing<Type extends Pick<IPlaylistSong, 'id'>>(
    playlistSongCollection: Type[],
    ...playlistSongsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const playlistSongs: Type[] = playlistSongsToCheck.filter(isPresent);
    if (playlistSongs.length > 0) {
      const playlistSongCollectionIdentifiers = playlistSongCollection.map(playlistSongItem =>
        this.getPlaylistSongIdentifier(playlistSongItem),
      );
      const playlistSongsToAdd = playlistSongs.filter(playlistSongItem => {
        const playlistSongIdentifier = this.getPlaylistSongIdentifier(playlistSongItem);
        if (playlistSongCollectionIdentifiers.includes(playlistSongIdentifier)) {
          return false;
        }
        playlistSongCollectionIdentifiers.push(playlistSongIdentifier);
        return true;
      });
      return [...playlistSongsToAdd, ...playlistSongCollection];
    }
    return playlistSongCollection;
  }

  protected convertValueFromClient<T extends IPlaylistSong | NewPlaylistSong | PartialUpdatePlaylistSong>(playlistSong: T): RestOf<T> {
    return {
      ...playlistSong,
      addedAt: playlistSong.addedAt?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestPlaylistSong): IPlaylistSong {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestPlaylistSong[]): IPlaylistSong[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
