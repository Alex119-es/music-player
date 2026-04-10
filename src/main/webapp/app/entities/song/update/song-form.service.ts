import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISong, NewSong } from '../song.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISong for edit and NewSongFormGroupInput for create.
 */
type SongFormGroupInput = ISong | PartialWithRequiredKeyOf<NewSong>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISong | NewSong> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type SongFormRawValue = FormValueOf<ISong>;

type NewSongFormRawValue = FormValueOf<NewSong>;

type SongFormDefaults = Pick<NewSong, 'id' | 'createdAt' | 'artistses'>;

type SongFormGroupContent = {
  id: FormControl<SongFormRawValue['id'] | NewSong['id']>;
  title: FormControl<SongFormRawValue['title']>;
  duration: FormControl<SongFormRawValue['duration']>;
  fileUrl: FormControl<SongFormRawValue['fileUrl']>;
  coverImage: FormControl<SongFormRawValue['coverImage']>;
  lyrics: FormControl<SongFormRawValue['lyrics']>;
  releaseDate: FormControl<SongFormRawValue['releaseDate']>;
  createdAt: FormControl<SongFormRawValue['createdAt']>;
  album: FormControl<SongFormRawValue['album']>;
  genre: FormControl<SongFormRawValue['genre']>;
  artistses: FormControl<SongFormRawValue['artistses']>;
};

export type SongFormGroup = FormGroup<SongFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SongFormService {
  createSongFormGroup(song?: SongFormGroupInput): SongFormGroup {
    const songRawValue = this.convertSongToSongRawValue({
      ...this.getFormDefaults(),
      ...(song ?? { id: null }),
    });
    return new FormGroup<SongFormGroupContent>({
      id: new FormControl(
        { value: songRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(songRawValue.title, {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      duration: new FormControl(songRawValue.duration),
      fileUrl: new FormControl(songRawValue.fileUrl, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      coverImage: new FormControl(songRawValue.coverImage, {
        validators: [Validators.maxLength(255)],
      }),
      lyrics: new FormControl(songRawValue.lyrics),
      releaseDate: new FormControl(songRawValue.releaseDate),
      createdAt: new FormControl(songRawValue.createdAt),
      album: new FormControl(songRawValue.album),
      genre: new FormControl(songRawValue.genre),
      artistses: new FormControl(songRawValue.artistses ?? []),
    });
  }

  getSong(form: SongFormGroup): ISong | NewSong {
    return this.convertSongRawValueToSong(form.getRawValue() as SongFormRawValue | NewSongFormRawValue);
  }

  resetForm(form: SongFormGroup, song: SongFormGroupInput): void {
    const songRawValue = this.convertSongToSongRawValue({ ...this.getFormDefaults(), ...song });
    form.reset({
      ...songRawValue,
      id: { value: songRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): SongFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      artistses: [],
    };
  }

  private convertSongRawValueToSong(rawSong: SongFormRawValue | NewSongFormRawValue): ISong | NewSong {
    return {
      ...rawSong,
      createdAt: dayjs(rawSong.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertSongToSongRawValue(
    song: ISong | (Partial<NewSong> & SongFormDefaults),
  ): SongFormRawValue | PartialWithRequiredKeyOf<NewSongFormRawValue> {
    return {
      ...song,
      createdAt: song.createdAt ? song.createdAt.format(DATE_TIME_FORMAT) : undefined,
      artistses: song.artistses ?? [],
    };
  }
}
