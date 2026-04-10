import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';
import { IPlaylistSong } from '../playlist-song.model';
import { PlaylistSongService } from '../service/playlist-song.service';

import { PlaylistSongFormService } from './playlist-song-form.service';
import { PlaylistSongUpdate } from './playlist-song-update';

describe('PlaylistSong Management Update Component', () => {
  let comp: PlaylistSongUpdate;
  let fixture: ComponentFixture<PlaylistSongUpdate>;
  let activatedRoute: ActivatedRoute;
  let playlistSongFormService: PlaylistSongFormService;
  let playlistSongService: PlaylistSongService;
  let playlistService: PlaylistService;
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

    fixture = TestBed.createComponent(PlaylistSongUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    playlistSongFormService = TestBed.inject(PlaylistSongFormService);
    playlistSongService = TestBed.inject(PlaylistSongService);
    playlistService = TestBed.inject(PlaylistService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Playlist query and add missing value', () => {
      const playlistSong: IPlaylistSong = { id: 21492 };
      const playlist: IPlaylist = { id: 26585 };
      playlistSong.playlist = playlist;

      const playlistCollection: IPlaylist[] = [{ id: 26585 }];
      vitest.spyOn(playlistService, 'query').mockReturnValue(of(new HttpResponse({ body: playlistCollection })));
      const additionalPlaylists = [playlist];
      const expectedCollection: IPlaylist[] = [...additionalPlaylists, ...playlistCollection];
      vitest.spyOn(playlistService, 'addPlaylistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ playlistSong });
      comp.ngOnInit();

      expect(playlistService.query).toHaveBeenCalled();
      expect(playlistService.addPlaylistToCollectionIfMissing).toHaveBeenCalledWith(
        playlistCollection,
        ...additionalPlaylists.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.playlistsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Song query and add missing value', () => {
      const playlistSong: IPlaylistSong = { id: 21492 };
      const song: ISong = { id: 123 };
      playlistSong.song = song;

      const songCollection: ISong[] = [{ id: 123 }];
      vitest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [song];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      vitest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ playlistSong });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.songsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const playlistSong: IPlaylistSong = { id: 21492 };
      const playlist: IPlaylist = { id: 26585 };
      playlistSong.playlist = playlist;
      const song: ISong = { id: 123 };
      playlistSong.song = song;

      activatedRoute.data = of({ playlistSong });
      comp.ngOnInit();

      expect(comp.playlistsSharedCollection()).toContainEqual(playlist);
      expect(comp.songsSharedCollection()).toContainEqual(song);
      expect(comp.playlistSong).toEqual(playlistSong);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPlaylistSong>();
      const playlistSong = { id: 15074 };
      vitest.spyOn(playlistSongFormService, 'getPlaylistSong').mockReturnValue(playlistSong);
      vitest.spyOn(playlistSongService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlistSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(playlistSong);
      saveSubject.complete();

      // THEN
      expect(playlistSongFormService.getPlaylistSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(playlistSongService.update).toHaveBeenCalledWith(expect.objectContaining(playlistSong));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPlaylistSong>();
      const playlistSong = { id: 15074 };
      vitest.spyOn(playlistSongFormService, 'getPlaylistSong').mockReturnValue({ id: null });
      vitest.spyOn(playlistSongService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlistSong: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(playlistSong);
      saveSubject.complete();

      // THEN
      expect(playlistSongFormService.getPlaylistSong).toHaveBeenCalled();
      expect(playlistSongService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPlaylistSong>();
      const playlistSong = { id: 15074 };
      vitest.spyOn(playlistSongService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlistSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(playlistSongService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePlaylist', () => {
      it('should forward to playlistService', () => {
        const entity = { id: 26585 };
        const entity2 = { id: 6730 };
        vitest.spyOn(playlistService, 'comparePlaylist');
        comp.comparePlaylist(entity, entity2);
        expect(playlistService.comparePlaylist).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
