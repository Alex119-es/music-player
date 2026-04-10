import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../playlist.test-samples';

import { PlaylistFormService } from './playlist-form.service';

describe('Playlist Form Service', () => {
  let service: PlaylistFormService;

  beforeEach(() => {
    service = TestBed.inject(PlaylistFormService);
  });

  describe('Service methods', () => {
    describe('createPlaylistFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlaylistFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            isPublic: expect.any(Object),
            coverImage: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IPlaylist should create a new form with FormGroup', () => {
        const formGroup = service.createPlaylistFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            isPublic: expect.any(Object),
            coverImage: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlaylist', () => {
      it('should return NewPlaylist for default Playlist initial value', () => {
        const formGroup = service.createPlaylistFormGroup(sampleWithNewData);

        const playlist = service.getPlaylist(formGroup);

        expect(playlist).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlaylist for empty Playlist initial value', () => {
        const formGroup = service.createPlaylistFormGroup();

        const playlist = service.getPlaylist(formGroup);

        expect(playlist).toMatchObject({});
      });

      it('should return IPlaylist', () => {
        const formGroup = service.createPlaylistFormGroup(sampleWithRequiredData);

        const playlist = service.getPlaylist(formGroup);

        expect(playlist).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlaylist should not enable id FormControl', () => {
        const formGroup = service.createPlaylistFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlaylist should disable id FormControl', () => {
        const formGroup = service.createPlaylistFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
