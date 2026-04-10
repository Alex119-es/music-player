import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IArtist, NewArtist } from '../artist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IArtist for edit and NewArtistFormGroupInput for create.
 */
type ArtistFormGroupInput = IArtist | PartialWithRequiredKeyOf<NewArtist>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IArtist | NewArtist> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type ArtistFormRawValue = FormValueOf<IArtist>;

type NewArtistFormRawValue = FormValueOf<NewArtist>;

type ArtistFormDefaults = Pick<NewArtist, 'id' | 'verified' | 'createdAt' | 'songses'>;

type ArtistFormGroupContent = {
  id: FormControl<ArtistFormRawValue['id'] | NewArtist['id']>;
  name: FormControl<ArtistFormRawValue['name']>;
  bio: FormControl<ArtistFormRawValue['bio']>;
  image: FormControl<ArtistFormRawValue['image']>;
  country: FormControl<ArtistFormRawValue['country']>;
  verified: FormControl<ArtistFormRawValue['verified']>;
  createdAt: FormControl<ArtistFormRawValue['createdAt']>;
  songses: FormControl<ArtistFormRawValue['songses']>;
};

export type ArtistFormGroup = FormGroup<ArtistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ArtistFormService {
  createArtistFormGroup(artist?: ArtistFormGroupInput): ArtistFormGroup {
    const artistRawValue = this.convertArtistToArtistRawValue({
      ...this.getFormDefaults(),
      ...(artist ?? { id: null }),
    });
    return new FormGroup<ArtistFormGroupContent>({
      id: new FormControl(
        { value: artistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(artistRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      bio: new FormControl(artistRawValue.bio),
      image: new FormControl(artistRawValue.image, {
        validators: [Validators.maxLength(255)],
      }),
      country: new FormControl(artistRawValue.country, {
        validators: [Validators.maxLength(2)],
      }),
      verified: new FormControl(artistRawValue.verified),
      createdAt: new FormControl(artistRawValue.createdAt),
      songses: new FormControl(artistRawValue.songses ?? []),
    });
  }

  getArtist(form: ArtistFormGroup): IArtist | NewArtist {
    return this.convertArtistRawValueToArtist(form.getRawValue() as ArtistFormRawValue | NewArtistFormRawValue);
  }

  resetForm(form: ArtistFormGroup, artist: ArtistFormGroupInput): void {
    const artistRawValue = this.convertArtistToArtistRawValue({ ...this.getFormDefaults(), ...artist });
    form.reset({
      ...artistRawValue,
      id: { value: artistRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ArtistFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      verified: false,
      createdAt: currentTime,
      songses: [],
    };
  }

  private convertArtistRawValueToArtist(rawArtist: ArtistFormRawValue | NewArtistFormRawValue): IArtist | NewArtist {
    return {
      ...rawArtist,
      createdAt: dayjs(rawArtist.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertArtistToArtistRawValue(
    artist: IArtist | (Partial<NewArtist> & ArtistFormDefaults),
  ): ArtistFormRawValue | PartialWithRequiredKeyOf<NewArtistFormRawValue> {
    return {
      ...artist,
      createdAt: artist.createdAt ? artist.createdAt.format(DATE_TIME_FORMAT) : undefined,
      songses: artist.songses ?? [],
    };
  }
}
