import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ILike } from '../like.model';
import { LikeService } from '../service/like.service';

import { LikeFormGroup, LikeFormService } from './like-form.service';

@Component({
  selector: 'jhi-like-update',
  templateUrl: './like-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class LikeUpdate implements OnInit {
  readonly isSaving = signal(false);
  like: ILike | null = null;

  usersSharedCollection = signal<IUser[]>([]);
  songsSharedCollection = signal<ISong[]>([]);

  protected likeService = inject(LikeService);
  protected likeFormService = inject(LikeFormService);
  protected userService = inject(UserService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LikeFormGroup = this.likeFormService.createLikeFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ like }) => {
      this.like = like;
      if (like) {
        this.updateForm(like);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const like = this.likeFormService.getLike(this.editForm);
    if (like.id === null) {
      this.subscribeToSaveResponse(this.likeService.create(like));
    } else {
      this.subscribeToSaveResponse(this.likeService.update(like));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ILike | null>): void {
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

  protected updateForm(like: ILike): void {
    this.like = like;
    this.likeFormService.resetForm(this.editForm, like);

    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, like.user));
    this.songsSharedCollection.update(songs => this.songService.addSongToCollectionIfMissing<ISong>(songs, like.song));
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.like?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));

    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, this.like?.song)))
      .subscribe((songs: ISong[]) => this.songsSharedCollection.set(songs));
  }
}
