import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAlbum, NewAlbum } from '../album.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlbum for edit and NewAlbumFormGroupInput for create.
 */
type AlbumFormGroupInput = IAlbum | PartialWithRequiredKeyOf<NewAlbum>;

type AlbumFormDefaults = Pick<NewAlbum, 'id'>;

type AlbumFormGroupContent = {
  id: FormControl<IAlbum['id'] | NewAlbum['id']>;
  title: FormControl<IAlbum['title']>;
  coverImage: FormControl<IAlbum['coverImage']>;
  releaseDate: FormControl<IAlbum['releaseDate']>;
  albumType: FormControl<IAlbum['albumType']>;
  artist: FormControl<IAlbum['artist']>;
  genre: FormControl<IAlbum['genre']>;
};

export type AlbumFormGroup = FormGroup<AlbumFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlbumFormService {
  createAlbumFormGroup(album?: AlbumFormGroupInput): AlbumFormGroup {
    const albumRawValue = {
      ...this.getFormDefaults(),
      ...(album ?? { id: null }),
    };
    return new FormGroup<AlbumFormGroupContent>({
      id: new FormControl(
        { value: albumRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(albumRawValue.title, {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      coverImage: new FormControl(albumRawValue.coverImage, {
        validators: [Validators.maxLength(255)],
      }),
      releaseDate: new FormControl(albumRawValue.releaseDate),
      albumType: new FormControl(albumRawValue.albumType),
      artist: new FormControl(albumRawValue.artist, {
        validators: [Validators.required],
      }),
      genre: new FormControl(albumRawValue.genre),
    });
  }

  getAlbum(form: AlbumFormGroup): IAlbum | NewAlbum {
    return form.getRawValue() as IAlbum | NewAlbum;
  }

  resetForm(form: AlbumFormGroup, album: AlbumFormGroupInput): void {
    const albumRawValue = { ...this.getFormDefaults(), ...album };
    form.reset({
      ...albumRawValue,
      id: { value: albumRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AlbumFormDefaults {
    return {
      id: null,
    };
  }
}
