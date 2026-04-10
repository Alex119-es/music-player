import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../song.test-samples';

import { SongFormService } from './song-form.service';

describe('Song Form Service', () => {
  let service: SongFormService;

  beforeEach(() => {
    service = TestBed.inject(SongFormService);
  });

  describe('Service methods', () => {
    describe('createSongFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSongFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            duration: expect.any(Object),
            fileUrl: expect.any(Object),
            coverImage: expect.any(Object),
            lyrics: expect.any(Object),
            releaseDate: expect.any(Object),
            createdAt: expect.any(Object),
            album: expect.any(Object),
            genre: expect.any(Object),
            artistses: expect.any(Object),
          }),
        );
      });

      it('passing ISong should create a new form with FormGroup', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            duration: expect.any(Object),
            fileUrl: expect.any(Object),
            coverImage: expect.any(Object),
            lyrics: expect.any(Object),
            releaseDate: expect.any(Object),
            createdAt: expect.any(Object),
            album: expect.any(Object),
            genre: expect.any(Object),
            artistses: expect.any(Object),
          }),
        );
      });
    });

    describe('getSong', () => {
      it('should return NewSong for default Song initial value', () => {
        const formGroup = service.createSongFormGroup(sampleWithNewData);

        const song = service.getSong(formGroup);

        expect(song).toMatchObject(sampleWithNewData);
      });

      it('should return NewSong for empty Song initial value', () => {
        const formGroup = service.createSongFormGroup();

        const song = service.getSong(formGroup);

        expect(song).toMatchObject({});
      });

      it('should return ISong', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData);

        const song = service.getSong(formGroup);

        expect(song).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISong should not enable id FormControl', () => {
        const formGroup = service.createSongFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSong should disable id FormControl', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
