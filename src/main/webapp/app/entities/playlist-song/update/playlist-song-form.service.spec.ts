import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../playlist-song.test-samples';

import { PlaylistSongFormService } from './playlist-song-form.service';

describe('PlaylistSong Form Service', () => {
  let service: PlaylistSongFormService;

  beforeEach(() => {
    service = TestBed.inject(PlaylistSongFormService);
  });

  describe('Service methods', () => {
    describe('createPlaylistSongFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlaylistSongFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            position: expect.any(Object),
            addedAt: expect.any(Object),
            playlist: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });

      it('passing IPlaylistSong should create a new form with FormGroup', () => {
        const formGroup = service.createPlaylistSongFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            position: expect.any(Object),
            addedAt: expect.any(Object),
            playlist: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlaylistSong', () => {
      it('should return NewPlaylistSong for default PlaylistSong initial value', () => {
        const formGroup = service.createPlaylistSongFormGroup(sampleWithNewData);

        const playlistSong = service.getPlaylistSong(formGroup);

        expect(playlistSong).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlaylistSong for empty PlaylistSong initial value', () => {
        const formGroup = service.createPlaylistSongFormGroup();

        const playlistSong = service.getPlaylistSong(formGroup);

        expect(playlistSong).toMatchObject({});
      });

      it('should return IPlaylistSong', () => {
        const formGroup = service.createPlaylistSongFormGroup(sampleWithRequiredData);

        const playlistSong = service.getPlaylistSong(formGroup);

        expect(playlistSong).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlaylistSong should not enable id FormControl', () => {
        const formGroup = service.createPlaylistSongFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlaylistSong should disable id FormControl', () => {
        const formGroup = service.createPlaylistSongFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
