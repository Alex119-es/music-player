import dayjs from 'dayjs/esm';

import { IPlaylistSong, NewPlaylistSong } from './playlist-song.model';

export const sampleWithRequiredData: IPlaylistSong = {
  id: 16992,
};

export const sampleWithPartialData: IPlaylistSong = {
  id: 19665,
};

export const sampleWithFullData: IPlaylistSong = {
  id: 1461,
  position: 18203,
  addedAt: dayjs('2026-04-10T13:21'),
};

export const sampleWithNewData: NewPlaylistSong = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
