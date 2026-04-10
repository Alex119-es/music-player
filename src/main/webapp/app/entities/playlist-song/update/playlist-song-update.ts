import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IPlaylistSong } from '../playlist-song.model';
import { PlaylistSongService } from '../service/playlist-song.service';

import { PlaylistSongFormGroup, PlaylistSongFormService } from './playlist-song-form.service';

@Component({
  selector: 'jhi-playlist-song-update',
  templateUrl: './playlist-song-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PlaylistSongUpdate implements OnInit {
  readonly isSaving = signal(false);
  playlistSong: IPlaylistSong | null = null;

  playlistsSharedCollection = signal<IPlaylist[]>([]);
  songsSharedCollection = signal<ISong[]>([]);

  protected playlistSongService = inject(PlaylistSongService);
  protected playlistSongFormService = inject(PlaylistSongFormService);
  protected playlistService = inject(PlaylistService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlaylistSongFormGroup = this.playlistSongFormService.createPlaylistSongFormGroup();

  comparePlaylist = (o1: IPlaylist | null, o2: IPlaylist | null): boolean => this.playlistService.comparePlaylist(o1, o2);

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ playlistSong }) => {
      this.playlistSong = playlistSong;
      if (playlistSong) {
        this.updateForm(playlistSong);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const playlistSong = this.playlistSongFormService.getPlaylistSong(this.editForm);
    if (playlistSong.id === null) {
      this.subscribeToSaveResponse(this.playlistSongService.create(playlistSong));
    } else {
      this.subscribeToSaveResponse(this.playlistSongService.update(playlistSong));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPlaylistSong | null>): void {
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

  protected updateForm(playlistSong: IPlaylistSong): void {
    this.playlistSong = playlistSong;
    this.playlistSongFormService.resetForm(this.editForm, playlistSong);

    this.playlistsSharedCollection.update(playlists =>
      this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(playlists, playlistSong.playlist),
    );
    this.songsSharedCollection.update(songs => this.songService.addSongToCollectionIfMissing<ISong>(songs, playlistSong.song));
  }

  protected loadRelationshipsOptions(): void {
    this.playlistService
      .query()
      .pipe(map((res: HttpResponse<IPlaylist[]>) => res.body ?? []))
      .pipe(
        map((playlists: IPlaylist[]) =>
          this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(playlists, this.playlistSong?.playlist),
        ),
      )
      .subscribe((playlists: IPlaylist[]) => this.playlistsSharedCollection.set(playlists));

    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, this.playlistSong?.song)))
      .subscribe((songs: ISong[]) => this.songsSharedCollection.set(songs));
  }
}
