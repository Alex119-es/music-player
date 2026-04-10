import dayjs from 'dayjs/esm';

import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 2181,
  name: 'contravene clumsy',
};

export const sampleWithPartialData: IPlaylist = {
  id: 30640,
  name: 'bliss',
  description: '../fake-data/blob/hipster.txt',
  coverImage: 'decode bogus barring',
};

export const sampleWithFullData: IPlaylist = {
  id: 24677,
  name: 'rebound',
  description: '../fake-data/blob/hipster.txt',
  isPublic: false,
  coverImage: 'tomb even',
  createdAt: dayjs('2026-04-10T08:12'),
  updatedAt: dayjs('2026-04-10T15:05'),
};

export const sampleWithNewData: NewPlaylist = {
  name: 'and',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
