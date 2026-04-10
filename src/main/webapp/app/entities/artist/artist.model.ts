import dayjs from 'dayjs/esm';

import { ISong } from 'app/entities/song/song.model';

export interface IArtist {
  id: number;
  name?: string | null;
  bio?: string | null;
  image?: string | null;
  country?: string | null;
  verified?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  songses?: Pick<ISong, 'id'>[] | null;
}

export type NewArtist = Omit<IArtist, 'id'> & { id: null };
