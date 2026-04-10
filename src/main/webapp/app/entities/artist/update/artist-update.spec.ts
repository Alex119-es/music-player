import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';
import { IArtist } from '../artist.model';
import { ArtistService } from '../service/artist.service';

import { ArtistFormService } from './artist-form.service';
import { ArtistUpdate } from './artist-update';

describe('Artist Management Update Component', () => {
  let comp: ArtistUpdate;
  let fixture: ComponentFixture<ArtistUpdate>;
  let activatedRoute: ActivatedRoute;
  let artistFormService: ArtistFormService;
  let artistService: ArtistService;
  let songService: SongService;

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

    fixture = TestBed.createComponent(ArtistUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    artistFormService = TestBed.inject(ArtistFormService);
    artistService = TestBed.inject(ArtistService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Song query and add missing value', () => {
      const artist: IArtist = { id: 18977 };
      const songses: ISong[] = [{ id: 123 }];
      artist.songses = songses;

      const songCollection: ISong[] = [{ id: 123 }];
      vitest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [...songses];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      vitest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ artist });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.songsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const artist: IArtist = { id: 18977 };
      const songs: ISong = { id: 123 };
      artist.songses = [songs];

      activatedRoute.data = of({ artist });
      comp.ngOnInit();

      expect(comp.songsSharedCollection()).toContainEqual(songs);
      expect(comp.artist).toEqual(artist);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IArtist>();
      const artist = { id: 5568 };
      vitest.spyOn(artistFormService, 'getArtist').mockReturnValue(artist);
      vitest.spyOn(artistService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ artist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(artist);
      saveSubject.complete();

      // THEN
      expect(artistFormService.getArtist).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(artistService.update).toHaveBeenCalledWith(expect.objectContaining(artist));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IArtist>();
      const artist = { id: 5568 };
      vitest.spyOn(artistFormService, 'getArtist').mockReturnValue({ id: null });
      vitest.spyOn(artistService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ artist: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(artist);
      saveSubject.complete();

      // THEN
      expect(artistFormService.getArtist).toHaveBeenCalled();
      expect(artistService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IArtist>();
      const artist = { id: 5568 };
      vitest.spyOn(artistService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ artist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(artistService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSong', () => {
      it('should forward to songService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 16182 };
        vitest.spyOn(songService, 'compareSong');
        comp.compareSong(entity, entity2);
        expect(songService.compareSong).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
