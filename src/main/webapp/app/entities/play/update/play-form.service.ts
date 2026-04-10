import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPlay, NewPlay } from '../play.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlay for edit and NewPlayFormGroupInput for create.
 */
type PlayFormGroupInput = IPlay | PartialWithRequiredKeyOf<NewPlay>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPlay | NewPlay> = Omit<T, 'playedAt'> & {
  playedAt?: string | null;
};

type PlayFormRawValue = FormValueOf<IPlay>;

type NewPlayFormRawValue = FormValueOf<NewPlay>;

type PlayFormDefaults = Pick<NewPlay, 'id' | 'playedAt'>;

type PlayFormGroupContent = {
  id: FormControl<PlayFormRawValue['id'] | NewPlay['id']>;
  playedAt: FormControl<PlayFormRawValue['playedAt']>;
  durationListened: FormControl<PlayFormRawValue['durationListened']>;
  user: FormControl<PlayFormRawValue['user']>;
  song: FormControl<PlayFormRawValue['song']>;
};

export type PlayFormGroup = FormGroup<PlayFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlayFormService {
  createPlayFormGroup(play?: PlayFormGroupInput): PlayFormGroup {
    const playRawValue = this.convertPlayToPlayRawValue({
      ...this.getFormDefaults(),
      ...(play ?? { id: null }),
    });
    return new FormGroup<PlayFormGroupContent>({
      id: new FormControl(
        { value: playRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      playedAt: new FormControl(playRawValue.playedAt),
      durationListened: new FormControl(playRawValue.durationListened),
      user: new FormControl(playRawValue.user),
      song: new FormControl(playRawValue.song),
    });
  }

  getPlay(form: PlayFormGroup): IPlay | NewPlay {
    return this.convertPlayRawValueToPlay(form.getRawValue() as PlayFormRawValue | NewPlayFormRawValue);
  }

  resetForm(form: PlayFormGroup, play: PlayFormGroupInput): void {
    const playRawValue = this.convertPlayToPlayRawValue({ ...this.getFormDefaults(), ...play });
    form.reset({
      ...playRawValue,
      id: { value: playRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PlayFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      playedAt: currentTime,
    };
  }

  private convertPlayRawValueToPlay(rawPlay: PlayFormRawValue | NewPlayFormRawValue): IPlay | NewPlay {
    return {
      ...rawPlay,
      playedAt: dayjs(rawPlay.playedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPlayToPlayRawValue(
    play: IPlay | (Partial<NewPlay> & PlayFormDefaults),
  ): PlayFormRawValue | PartialWithRequiredKeyOf<NewPlayFormRawValue> {
    return {
      ...play,
      playedAt: play.playedAt ? play.playedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
