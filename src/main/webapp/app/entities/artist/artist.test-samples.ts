import dayjs from 'dayjs/esm';

import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: 31876,
  name: 'yin oof embed',
};

export const sampleWithPartialData: IArtist = {
  id: 6402,
  name: 'amongst',
  image: 'through wherever',
  createdAt: dayjs('2026-04-10T12:15'),
};

export const sampleWithFullData: IArtist = {
  id: 23323,
  name: 'fathom but',
  bio: '../fake-data/blob/hipster.txt',
  image: 'ridge',
  country: 'Tu',
  verified: false,
  createdAt: dayjs('2026-04-10T01:08'),
};

export const sampleWithNewData: NewArtist = {
  name: 'excitedly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
