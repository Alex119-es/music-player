import dayjs from 'dayjs/esm';

import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: 15539,
  title: 'kindly the encode',
};

export const sampleWithPartialData: IAlbum = {
  id: 18639,
  title: 'showboat masculinize',
  albumType: 'SINGLE',
};

export const sampleWithFullData: IAlbum = {
  id: 21227,
  title: 'tapioca ornate',
  coverImage: 'except',
  releaseDate: dayjs('2026-04-10'),
  albumType: 'EP',
};

export const sampleWithNewData: NewAlbum = {
  title: 'mozzarella suckle afore',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
