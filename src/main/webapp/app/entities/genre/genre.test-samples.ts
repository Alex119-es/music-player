import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: 14174,
  name: 'vague dreary what',
};

export const sampleWithPartialData: IGenre = {
  id: 12139,
  name: 'cleave',
};

export const sampleWithFullData: IGenre = {
  id: 17951,
  name: 'towards',
};

export const sampleWithNewData: NewGenre = {
  name: 'lampoon',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
