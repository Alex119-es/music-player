import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPlaylist, NewPlaylist } from '../playlist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlaylist for edit and NewPlaylistFormGroupInput for create.
 */
type PlaylistFormGroupInput = IPlaylist | PartialWithRequiredKeyOf<NewPlaylist>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPlaylist | NewPlaylist> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type PlaylistFormRawValue = FormValueOf<IPlaylist>;

type NewPlaylistFormRawValue = FormValueOf<NewPlaylist>;

type PlaylistFormDefaults = Pick<NewPlaylist, 'id' | 'isPublic' | 'createdAt' | 'updatedAt'>;

type PlaylistFormGroupContent = {
  id: FormControl<PlaylistFormRawValue['id'] | NewPlaylist['id']>;
  name: FormControl<PlaylistFormRawValue['name']>;
  description: FormControl<PlaylistFormRawValue['description']>;
  isPublic: FormControl<PlaylistFormRawValue['isPublic']>;
  coverImage: FormControl<PlaylistFormRawValue['coverImage']>;
  createdAt: FormControl<PlaylistFormRawValue['createdAt']>;
  updatedAt: FormControl<PlaylistFormRawValue['updatedAt']>;
  user: FormControl<PlaylistFormRawValue['user']>;
};

export type PlaylistFormGroup = FormGroup<PlaylistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlaylistFormService {
  createPlaylistFormGroup(playlist?: PlaylistFormGroupInput): PlaylistFormGroup {
    const playlistRawValue = this.convertPlaylistToPlaylistRawValue({
      ...this.getFormDefaults(),
      ...(playlist ?? { id: null }),
    });
    return new FormGroup<PlaylistFormGroupContent>({
      id: new FormControl(
        { value: playlistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(playlistRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: new FormControl(playlistRawValue.description),
      isPublic: new FormControl(playlistRawValue.isPublic),
      coverImage: new FormControl(playlistRawValue.coverImage, {
        validators: [Validators.maxLength(255)],
      }),
      createdAt: new FormControl(playlistRawValue.createdAt),
      updatedAt: new FormControl(playlistRawValue.updatedAt),
      user: new FormControl(playlistRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getPlaylist(form: PlaylistFormGroup): IPlaylist | NewPlaylist {
    return this.convertPlaylistRawValueToPlaylist(form.getRawValue() as PlaylistFormRawValue | NewPlaylistFormRawValue);
  }

  resetForm(form: PlaylistFormGroup, playlist: PlaylistFormGroupInput): void {
    const playlistRawValue = this.convertPlaylistToPlaylistRawValue({ ...this.getFormDefaults(), ...playlist });
    form.reset({
      ...playlistRawValue,
      id: { value: playlistRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PlaylistFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isPublic: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertPlaylistRawValueToPlaylist(rawPlaylist: PlaylistFormRawValue | NewPlaylistFormRawValue): IPlaylist | NewPlaylist {
    return {
      ...rawPlaylist,
      createdAt: dayjs(rawPlaylist.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawPlaylist.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPlaylistToPlaylistRawValue(
    playlist: IPlaylist | (Partial<NewPlaylist> & PlaylistFormDefaults),
  ): PlaylistFormRawValue | PartialWithRequiredKeyOf<NewPlaylistFormRawValue> {
    return {
      ...playlist,
      createdAt: playlist.createdAt ? playlist.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: playlist.updatedAt ? playlist.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
