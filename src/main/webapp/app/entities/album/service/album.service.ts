import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAlbum, NewAlbum } from '../album.model';

export type PartialUpdateAlbum = Partial<IAlbum> & Pick<IAlbum, 'id'>;

type RestOf<T extends IAlbum | NewAlbum> = Omit<T, 'releaseDate'> & {
  releaseDate?: string | null;
};

export type RestAlbum = RestOf<IAlbum>;

export type NewRestAlbum = RestOf<NewAlbum>;

export type PartialUpdateRestAlbum = RestOf<PartialUpdateAlbum>;

@Injectable()
export class AlbumsService {
  readonly albumsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);

  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/albums');
  protected readonly myResourceUrl = this.applicationConfigService.getEndpointFor('api/albums/my');

  readonly albumsResource = httpResource<RestAlbum[]>(() => {
    const params = this.albumsParams();
    if (!params) return undefined;
    return { url: this.resourceUrl, params };
  });

  readonly albums = computed(() =>
    (this.albumsResource.hasValue() ? this.albumsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );

  readonly myAlbumsResource = httpResource<RestAlbum[]>(() => {
    return { url: this.myResourceUrl };
  });

  readonly myAlbums = computed(() => {
    const data = this.myAlbumsResource.value();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => this.convertValueFromServer(item));
  });
  protected convertValueFromClient<T extends IAlbum | NewAlbum | PartialUpdateAlbum>(album: T): RestOf<T> {
    return {
      ...album,
      releaseDate: album.releaseDate ? dayjs(album.releaseDate).toISOString() : null,
    };
  }
  protected convertValueFromServer(restAlbum: RestAlbum): IAlbum {
    return {
      ...restAlbum,
      releaseDate: restAlbum.releaseDate ?? null,
    };
  }
  protected convertResponseArrayFromServer(res: RestAlbum[]): IAlbum[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}

@Injectable({ providedIn: 'root' })
export class AlbumService extends AlbumsService {
  protected readonly http = inject(HttpClient);

  create(album: NewAlbum): Observable<IAlbum> {
    const copy = this.convertValueFromClient(album);
    return this.http.post<RestAlbum>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(album: IAlbum): Observable<IAlbum> {
    const copy = this.convertValueFromClient(album);
    return this.http
      .put<RestAlbum>(`${this.resourceUrl}/${encodeURIComponent(this.getAlbumIdentifier(album))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  protected convertResponseFromServer(res: RestAlbum): IAlbum {
    return this.convertValueFromServer(res);
  }
  partialUpdate(album: PartialUpdateAlbum): Observable<IAlbum> {
    const copy = this.convertValueFromClient(album);
    return this.http
      .patch<RestAlbum>(`${this.resourceUrl}/${encodeURIComponent(this.getAlbumIdentifier(album))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAlbum> {
    return this.http.get<RestAlbum>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }
  uploadImage(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>('/api/upload/image', formData);
  }
  query(req?: any): Observable<HttpResponse<IAlbum[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAlbum[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAlbumIdentifier(album: Pick<IAlbum, 'id'>): number {
    return album.id;
  }

  compareAlbum(o1: Pick<IAlbum, 'id'> | null, o2: Pick<IAlbum, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlbumIdentifier(o1) === this.getAlbumIdentifier(o2) : o1 === o2;
  }

  addAlbumToCollectionIfMissing<Type extends Pick<IAlbum, 'id'>>(
    albumCollection: Type[],
    ...albumsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const albums: Type[] = albumsToCheck.filter(isPresent);
    if (albums.length > 0) {
      const albumCollectionIdentifiers = albumCollection.map(albumItem => this.getAlbumIdentifier(albumItem));
      const albumsToAdd = albums.filter(albumItem => {
        const albumIdentifier = this.getAlbumIdentifier(albumItem);
        if (albumCollectionIdentifiers.includes(albumIdentifier)) {
          return false;
        }
        albumCollectionIdentifiers.push(albumIdentifier);
        return true;
      });
      return [...albumsToAdd, ...albumCollection];
    }
    return albumCollection;
  }

  protected convertValueFromClient<T extends IAlbum | NewAlbum | PartialUpdateAlbum>(album: T): RestOf<T> {
    return {
      ...album,
      releaseDate: album.releaseDate ?? null,
    };
  }

  getUpcoming(): Observable<IAlbum[]> {
    return this.http.get<IAlbum[]>(this.resourceUrl + '/upcoming');
  }
  queryUpcoming(): Observable<HttpResponse<IAlbum[]>> {
    return this.http.get<IAlbum[]>(this.applicationConfigService.getEndpointFor('api/albums/upcoming'), {
      observe: 'response',
    });
  }
}
