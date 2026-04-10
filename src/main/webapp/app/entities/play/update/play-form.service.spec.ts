import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../play.test-samples';

import { PlayFormService } from './play-form.service';

describe('Play Form Service', () => {
  let service: PlayFormService;

  beforeEach(() => {
    service = TestBed.inject(PlayFormService);
  });

  describe('Service methods', () => {
    describe('createPlayFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlayFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            playedAt: expect.any(Object),
            durationListened: expect.any(Object),
            user: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });

      it('passing IPlay should create a new form with FormGroup', () => {
        const formGroup = service.createPlayFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            playedAt: expect.any(Object),
            durationListened: expect.any(Object),
            user: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlay', () => {
      it('should return NewPlay for default Play initial value', () => {
        const formGroup = service.createPlayFormGroup(sampleWithNewData);

        const play = service.getPlay(formGroup);

        expect(play).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlay for empty Play initial value', () => {
        const formGroup = service.createPlayFormGroup();

        const play = service.getPlay(formGroup);

        expect(play).toMatchObject({});
      });

      it('should return IPlay', () => {
        const formGroup = service.createPlayFormGroup(sampleWithRequiredData);

        const play = service.getPlay(formGroup);

        expect(play).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlay should not enable id FormControl', () => {
        const formGroup = service.createPlayFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlay should disable id FormControl', () => {
        const formGroup = service.createPlayFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
