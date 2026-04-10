import dayjs from 'dayjs/esm';

import { IPlay, NewPlay } from './play.model';

export const sampleWithRequiredData: IPlay = {
  id: 18240,
};

export const sampleWithPartialData: IPlay = {
  id: 4059,
};

export const sampleWithFullData: IPlay = {
  id: 21546,
  playedAt: dayjs('2026-04-09T21:01'),
  durationListened: 8790,
};

export const sampleWithNewData: NewPlay = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
