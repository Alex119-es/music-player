import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../like.test-samples';

import { LikeFormService } from './like-form.service';

describe('Like Form Service', () => {
  let service: LikeFormService;

  beforeEach(() => {
    service = TestBed.inject(LikeFormService);
  });

  describe('Service methods', () => {
    describe('createLikeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLikeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdAt: expect.any(Object),
            user: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });

      it('passing ILike should create a new form with FormGroup', () => {
        const formGroup = service.createLikeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdAt: expect.any(Object),
            user: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });
    });

    describe('getLike', () => {
      it('should return NewLike for default Like initial value', () => {
        const formGroup = service.createLikeFormGroup(sampleWithNewData);

        const like = service.getLike(formGroup);

        expect(like).toMatchObject(sampleWithNewData);
      });

      it('should return NewLike for empty Like initial value', () => {
        const formGroup = service.createLikeFormGroup();

        const like = service.getLike(formGroup);

        expect(like).toMatchObject({});
      });

      it('should return ILike', () => {
        const formGroup = service.createLikeFormGroup(sampleWithRequiredData);

        const like = service.getLike(formGroup);

        expect(like).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILike should not enable id FormControl', () => {
        const formGroup = service.createLikeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLike should disable id FormControl', () => {
        const formGroup = service.createLikeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
