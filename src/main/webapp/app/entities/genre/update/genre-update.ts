import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IGenre } from '../genre.model';
import { GenreService } from '../service/genre.service';

import { GenreFormGroup, GenreFormService } from './genre-form.service';

@Component({
  selector: 'jhi-genre-update',
  templateUrl: './genre-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class GenreUpdate implements OnInit {
  readonly isSaving = signal(false);
  genre: IGenre | null = null;

  protected genreService = inject(GenreService);
  protected genreFormService = inject(GenreFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GenreFormGroup = this.genreFormService.createGenreFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ genre }) => {
      this.genre = genre;
      if (genre) {
        this.updateForm(genre);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const genre = this.genreFormService.getGenre(this.editForm);
    if (genre.id === null) {
      this.subscribeToSaveResponse(this.genreService.create(genre));
    } else {
      this.subscribeToSaveResponse(this.genreService.update(genre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IGenre | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(genre: IGenre): void {
    this.genre = genre;
    this.genreFormService.resetForm(this.editForm, genre);
  }
}
