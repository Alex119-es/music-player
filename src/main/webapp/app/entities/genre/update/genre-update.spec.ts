import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IGenre } from '../genre.model';
import { GenreService } from '../service/genre.service';

import { GenreFormService } from './genre-form.service';
import { GenreUpdate } from './genre-update';

describe('Genre Management Update Component', () => {
  let comp: GenreUpdate;
  let fixture: ComponentFixture<GenreUpdate>;
  let activatedRoute: ActivatedRoute;
  let genreFormService: GenreFormService;
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

    fixture = TestBed.createComponent(GenreUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    genreFormService = TestBed.inject(GenreFormService);
    genreService = TestBed.inject(GenreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const genre: IGenre = { id: 30203 };

      activatedRoute.data = of({ genre });
      comp.ngOnInit();

      expect(comp.genre).toEqual(genre);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IGenre>();
      const genre = { id: 2628 };
      vitest.spyOn(genreFormService, 'getGenre').mockReturnValue(genre);
      vitest.spyOn(genreService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(genre);
      saveSubject.complete();

      // THEN
      expect(genreFormService.getGenre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(genreService.update).toHaveBeenCalledWith(expect.objectContaining(genre));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IGenre>();
      const genre = { id: 2628 };
      vitest.spyOn(genreFormService, 'getGenre').mockReturnValue({ id: null });
      vitest.spyOn(genreService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(genre);
      saveSubject.complete();

      // THEN
      expect(genreFormService.getGenre).toHaveBeenCalled();
      expect(genreService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IGenre>();
      const genre = { id: 2628 };
      vitest.spyOn(genreService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(genreService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
