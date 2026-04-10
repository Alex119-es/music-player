import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';

import { AlbumFormService } from './album-form.service';
import { AlbumUpdate } from './album-update';

describe('Album Management Update Component', () => {
  let comp: AlbumUpdate;
  let fixture: ComponentFixture<AlbumUpdate>;
  let activatedRoute: ActivatedRoute;
  let albumFormService: AlbumFormService;
  let albumService: AlbumService;
  let artistService: ArtistService;
  let genreService: GenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(AlbumUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    albumFormService = TestBed.inject(AlbumFormService);
    albumService = TestBed.inject(AlbumService);
    artistService = TestBed.inject(ArtistService);
    genreService = TestBed.inject(GenreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Artist query and add missing value', () => {
      const album: IAlbum = { id: 2495 };
      const artist: IArtist = { id: 5568 };
      album.artist = artist;

      const artistCollection: IArtist[] = [{ id: 5568 }];
      vitest.spyOn(artistService, 'query').mockReturnValue(of(new HttpResponse({ body: artistCollection })));
      const additionalArtists = [artist];
      const expectedCollection: IArtist[] = [...additionalArtists, ...artistCollection];
      vitest.spyOn(artistService, 'addArtistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(artistService.query).toHaveBeenCalled();
      expect(artistService.addArtistToCollectionIfMissing).toHaveBeenCalledWith(
        artistCollection,
        ...additionalArtists.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.artistsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Genre query and add missing value', () => {
      const album: IAlbum = { id: 2495 };
      const genre: IGenre = { id: 2628 };
      album.genre = genre;

      const genreCollection: IGenre[] = [{ id: 2628 }];
      vitest.spyOn(genreService, 'query').mockReturnValue(of(new HttpResponse({ body: genreCollection })));
      const additionalGenres = [genre];
      const expectedCollection: IGenre[] = [...additionalGenres, ...genreCollection];
      vitest.spyOn(genreService, 'addGenreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(genreService.query).toHaveBeenCalled();
      expect(genreService.addGenreToCollectionIfMissing).toHaveBeenCalledWith(
        genreCollection,
        ...additionalGenres.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.genresSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const album: IAlbum = { id: 2495 };
      const artist: IArtist = { id: 5568 };
      album.artist = artist;
      const genre: IGenre = { id: 2628 };
      album.genre = genre;

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(comp.artistsSharedCollection()).toContainEqual(artist);
      expect(comp.genresSharedCollection()).toContainEqual(genre);
      expect(comp.album).toEqual(album);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAlbum>();
      const album = { id: 4670 };
      vitest.spyOn(albumFormService, 'getAlbum').mockReturnValue(album);
      vitest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(album);
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(albumService.update).toHaveBeenCalledWith(expect.objectContaining(album));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAlbum>();
      const album = { id: 4670 };
      vitest.spyOn(albumFormService, 'getAlbum').mockReturnValue({ id: null });
      vitest.spyOn(albumService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(album);
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(albumService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAlbum>();
      const album = { id: 4670 };
      vitest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(albumService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareArtist', () => {
      it('should forward to artistService', () => {
        const entity = { id: 5568 };
        const entity2 = { id: 18977 };
        vitest.spyOn(artistService, 'compareArtist');
        comp.compareArtist(entity, entity2);
        expect(artistService.compareArtist).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGenre', () => {
      it('should forward to genreService', () => {
        const entity = { id: 2628 };
        const entity2 = { id: 30203 };
        vitest.spyOn(genreService, 'compareGenre');
        comp.compareGenre(entity, entity2);
        expect(genreService.compareGenre).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
