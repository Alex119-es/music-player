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
import { IPlay } from '../play.model';
import { PlayService } from '../service/play.service';

import { PlayFormGroup, PlayFormService } from './play-form.service';

@Component({
  selector: 'jhi-play-update',
  templateUrl: './play-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PlayUpdate implements OnInit {
  readonly isSaving = signal(false);
  play: IPlay | null = null;

  usersSharedCollection = signal<IUser[]>([]);
  songsSharedCollection = signal<ISong[]>([]);

  protected playService = inject(PlayService);
  protected playFormService = inject(PlayFormService);
  protected userService = inject(UserService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlayFormGroup = this.playFormService.createPlayFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ play }) => {
      this.play = play;
      if (play) {
        this.updateForm(play);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const play = this.playFormService.getPlay(this.editForm);
    if (play.id === null) {
      this.subscribeToSaveResponse(this.playService.create(play));
    } else {
      this.subscribeToSaveResponse(this.playService.update(play));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPlay | null>): void {
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

  protected updateForm(play: IPlay): void {
    this.play = play;
    this.playFormService.resetForm(this.editForm, play);

    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, play.user));
    this.songsSharedCollection.update(songs => this.songService.addSongToCollectionIfMissing<ISong>(songs, play.song));
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.play?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));

    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, this.play?.song)))
      .subscribe((songs: ISong[]) => this.songsSharedCollection.set(songs));
  }
}
