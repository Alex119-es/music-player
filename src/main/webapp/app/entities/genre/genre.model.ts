export interface IGenre {
  id: number;
  name?: string | null;
}

export type NewGenre = Omit<IGenre, 'id'> & { id: null };
