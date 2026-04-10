import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../genre.test-samples';

import { GenreFormService } from './genre-form.service';

describe('Genre Form Service', () => {
  let service: GenreFormService;

  beforeEach(() => {
    service = TestBed.inject(GenreFormService);
  });

  describe('Service methods', () => {
    describe('createGenreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGenreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IGenre should create a new form with FormGroup', () => {
        const formGroup = service.createGenreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getGenre', () => {
      it('should return NewGenre for default Genre initial value', () => {
        const formGroup = service.createGenreFormGroup(sampleWithNewData);

        const genre = service.getGenre(formGroup);

        expect(genre).toMatchObject(sampleWithNewData);
      });

      it('should return NewGenre for empty Genre initial value', () => {
        const formGroup = service.createGenreFormGroup();

        const genre = service.getGenre(formGroup);

        expect(genre).toMatchObject({});
      });

      it('should return IGenre', () => {
        const formGroup = service.createGenreFormGroup(sampleWithRequiredData);

        const genre = service.getGenre(formGroup);

        expect(genre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGenre should not enable id FormControl', () => {
        const formGroup = service.createGenreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGenre should disable id FormControl', () => {
        const formGroup = service.createGenreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
