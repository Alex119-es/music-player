import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IGenre, NewGenre } from '../genre.model';

export type PartialUpdateGenre = Partial<IGenre> & Pick<IGenre, 'id'>;

@Injectable()
export class GenresService {
  readonly genresParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly genresResource = httpResource<IGenre[]>(() => {
    const params = this.genresParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of genre that have been fetched. It is updated when the genresResource emits a new value.
   * In case of error while fetching the genres, the signal is set to an empty array.
   */
  readonly genres = computed(() => (this.genresResource.hasValue() ? this.genresResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/genres');
}

@Injectable({ providedIn: 'root' })
export class GenreService extends GenresService {
  protected readonly http = inject(HttpClient);

  create(genre: NewGenre): Observable<IGenre> {
    return this.http.post<IGenre>(this.resourceUrl, genre);
  }

  update(genre: IGenre): Observable<IGenre> {
    return this.http.put<IGenre>(`${this.resourceUrl}/${encodeURIComponent(this.getGenreIdentifier(genre))}`, genre);
  }

  partialUpdate(genre: PartialUpdateGenre): Observable<IGenre> {
    return this.http.patch<IGenre>(`${this.resourceUrl}/${encodeURIComponent(this.getGenreIdentifier(genre))}`, genre);
  }

  find(id: number): Observable<IGenre> {
    return this.http.get<IGenre>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IGenre[]>> {
    const options = createRequestOption(req);
    return this.http.get<IGenre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getGenreIdentifier(genre: Pick<IGenre, 'id'>): number {
    return genre.id;
  }

  compareGenre(o1: Pick<IGenre, 'id'> | null, o2: Pick<IGenre, 'id'> | null): boolean {
    return o1 && o2 ? this.getGenreIdentifier(o1) === this.getGenreIdentifier(o2) : o1 === o2;
  }

  addGenreToCollectionIfMissing<Type extends Pick<IGenre, 'id'>>(
    genreCollection: Type[],
    ...genresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const genres: Type[] = genresToCheck.filter(isPresent);
    if (genres.length > 0) {
      const genreCollectionIdentifiers = genreCollection.map(genreItem => this.getGenreIdentifier(genreItem));
      const genresToAdd = genres.filter(genreItem => {
        const genreIdentifier = this.getGenreIdentifier(genreItem);
        if (genreCollectionIdentifiers.includes(genreIdentifier)) {
          return false;
        }
        genreCollectionIdentifiers.push(genreIdentifier);
        return true;
      });
      return [...genresToAdd, ...genreCollection];
    }
    return genreCollection;
  }
}
