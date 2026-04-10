import dayjs from 'dayjs/esm';

import { ILike, NewLike } from './like.model';

export const sampleWithRequiredData: ILike = {
  id: 22025,
};

export const sampleWithPartialData: ILike = {
  id: 20324,
  createdAt: dayjs('2026-04-10T11:12'),
};

export const sampleWithFullData: ILike = {
  id: 4894,
  createdAt: dayjs('2026-04-10T05:51'),
};

export const sampleWithNewData: NewLike = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
