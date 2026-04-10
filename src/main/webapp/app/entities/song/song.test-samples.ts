import dayjs from 'dayjs/esm';

import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 18052,
  title: 'dress',
  fileUrl: 'briskly bootleg',
};

export const sampleWithPartialData: ISong = {
  id: 27535,
  title: 'yippee',
  duration: 27678,
  fileUrl: 'for',
  coverImage: 'decent where duster',
  releaseDate: dayjs('2026-04-10'),
  createdAt: dayjs('2026-04-09T23:13'),
};

export const sampleWithFullData: ISong = {
  id: 18594,
  title: 'daily',
  duration: 17054,
  fileUrl: 'blushing shyly gripper',
  coverImage: 'overcooked musty',
  lyrics: '../fake-data/blob/hipster.txt',
  releaseDate: dayjs('2026-04-09'),
  createdAt: dayjs('2026-04-10T17:13'),
};

export const sampleWithNewData: NewSong = {
  title: 'arrange accelerator quaintly',
  fileUrl: 'absent packaging',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
