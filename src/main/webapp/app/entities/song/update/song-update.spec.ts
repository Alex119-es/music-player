import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { SongService } from '../service/song.service';
import { ISong } from '../song.model';

import { SongFormService } from './song-form.service';
import { SongUpdate } from './song-update';

describe('Song Management Update Component', () => {
  let comp: SongUpdate;
  let fixture: ComponentFixture<SongUpdate>;
  let activatedRoute: ActivatedRoute;
  let songFormService: SongFormService;
  let songService: SongService;
  let albumService: AlbumService;
  let genreService: GenreService;
  let artistService: ArtistService;

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

    fixture = TestBed.createComponent(SongUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    songFormService = TestBed.inject(SongFormService);
    songService = TestBed.inject(SongService);
    albumService = TestBed.inject(AlbumService);
    genreService = TestBed.inject(GenreService);
    artistService = TestBed.inject(ArtistService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Album query and add missing value', () => {
      const song: ISong = { id: 16182 };
      const album: IAlbum = { id: 4670 };
      song.album = album;

      const albumCollection: IAlbum[] = [{ id: 4670 }];
      vitest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [album];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      vitest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(
        albumCollection,
        ...additionalAlbums.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.albumsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Genre query and add missing value', () => {
      const song: ISong = { id: 16182 };
      const genre: IGenre = { id: 2628 };
      song.genre = genre;

      const genreCollection: IGenre[] = [{ id: 2628 }];
      vitest.spyOn(genreService, 'query').mockReturnValue(of(new HttpResponse({ body: genreCollection })));
      const additionalGenres = [genre];
      const expectedCollection: IGenre[] = [...additionalGenres, ...genreCollection];
      vitest.spyOn(genreService, 'addGenreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(genreService.query).toHaveBeenCalled();
      expect(genreService.addGenreToCollectionIfMissing).toHaveBeenCalledWith(
        genreCollection,
        ...additionalGenres.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.genresSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Artist query and add missing value', () => {
      const song: ISong = { id: 16182 };
      const artistses: IArtist[] = [{ id: 5568 }];
      song.artistses = artistses;

      const artistCollection: IArtist[] = [{ id: 5568 }];
      vitest.spyOn(artistService, 'query').mockReturnValue(of(new HttpResponse({ body: artistCollection })));
      const additionalArtists = [...artistses];
      const expectedCollection: IArtist[] = [...additionalArtists, ...artistCollection];
      vitest.spyOn(artistService, 'addArtistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(artistService.query).toHaveBeenCalled();
      expect(artistService.addArtistToCollectionIfMissing).toHaveBeenCalledWith(
        artistCollection,
        ...additionalArtists.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.artistsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const song: ISong = { id: 16182 };
      const album: IAlbum = { id: 4670 };
      song.album = album;
      const genre: IGenre = { id: 2628 };
      song.genre = genre;
      const artists: IArtist = { id: 5568 };
      song.artistses = [artists];

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(comp.albumsSharedCollection()).toContainEqual(album);
      expect(comp.genresSharedCollection()).toContainEqual(genre);
      expect(comp.artistsSharedCollection()).toContainEqual(artists);
      expect(comp.song).toEqual(song);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ISong>();
      const song = { id: 123 };
      vitest.spyOn(songFormService, 'getSong').mockReturnValue(song);
      vitest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(song);
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(songService.update).toHaveBeenCalledWith(expect.objectContaining(song));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ISong>();
      const song = { id: 123 };
      vitest.spyOn(songFormService, 'getSong').mockReturnValue({ id: null });
      vitest.spyOn(songService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(song);
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(songService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ISong>();
      const song = { id: 123 };
      vitest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(songService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAlbum', () => {
      it('should forward to albumService', () => {
        const entity = { id: 4670 };
        const entity2 = { id: 2495 };
        vitest.spyOn(albumService, 'compareAlbum');
        comp.compareAlbum(entity, entity2);
        expect(albumService.compareAlbum).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareArtist', () => {
      it('should forward to artistService', () => {
        const entity = { id: 5568 };
        const entity2 = { id: 18977 };
        vitest.spyOn(artistService, 'compareArtist');
        comp.compareArtist(entity, entity2);
        expect(artistService.compareArtist).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
