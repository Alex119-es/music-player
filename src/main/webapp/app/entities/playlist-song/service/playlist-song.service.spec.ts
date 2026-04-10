import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPlaylistSong } from '../playlist-song.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../playlist-song.test-samples';

import { PlaylistSongService, RestPlaylistSong } from './playlist-song.service';

const requireRestSample: RestPlaylistSong = {
  ...sampleWithRequiredData,
  addedAt: sampleWithRequiredData.addedAt?.toJSON(),
};

describe('PlaylistSong Service', () => {
  let service: PlaylistSongService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlaylistSong | IPlaylistSong[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlaylistSongService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a PlaylistSong', () => {
      const playlistSong = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(playlistSong).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PlaylistSong', () => {
      const playlistSong = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(playlistSong).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PlaylistSong', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PlaylistSong', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PlaylistSong', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addPlaylistSongToCollectionIfMissing', () => {
      it('should add a PlaylistSong to an empty array', () => {
        const playlistSong: IPlaylistSong = sampleWithRequiredData;
        expectedResult = service.addPlaylistSongToCollectionIfMissing([], playlistSong);
        expect(expectedResult).toEqual([playlistSong]);
      });

      it('should not add a PlaylistSong to an array that contains it', () => {
        const playlistSong: IPlaylistSong = sampleWithRequiredData;
        const playlistSongCollection: IPlaylistSong[] = [
          {
            ...playlistSong,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlaylistSongToCollectionIfMissing(playlistSongCollection, playlistSong);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PlaylistSong to an array that doesn't contain it", () => {
        const playlistSong: IPlaylistSong = sampleWithRequiredData;
        const playlistSongCollection: IPlaylistSong[] = [sampleWithPartialData];
        expectedResult = service.addPlaylistSongToCollectionIfMissing(playlistSongCollection, playlistSong);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(playlistSong);
      });

      it('should add only unique PlaylistSong to an array', () => {
        const playlistSongArray: IPlaylistSong[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const playlistSongCollection: IPlaylistSong[] = [sampleWithRequiredData];
        expectedResult = service.addPlaylistSongToCollectionIfMissing(playlistSongCollection, ...playlistSongArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const playlistSong: IPlaylistSong = sampleWithRequiredData;
        const playlistSong2: IPlaylistSong = sampleWithPartialData;
        expectedResult = service.addPlaylistSongToCollectionIfMissing([], playlistSong, playlistSong2);
        expect(expectedResult).toEqual([playlistSong, playlistSong2]);
      });

      it('should accept null and undefined values', () => {
        const playlistSong: IPlaylistSong = sampleWithRequiredData;
        expectedResult = service.addPlaylistSongToCollectionIfMissing([], null, playlistSong, undefined);
        expect(expectedResult).toEqual([playlistSong]);
      });

      it('should return initial array if no PlaylistSong is added', () => {
        const playlistSongCollection: IPlaylistSong[] = [sampleWithRequiredData];
        expectedResult = service.addPlaylistSongToCollectionIfMissing(playlistSongCollection, undefined, null);
        expect(expectedResult).toEqual(playlistSongCollection);
      });
    });

    describe('comparePlaylistSong', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlaylistSong(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15074 };
        const entity2 = null;

        const compareResult1 = service.comparePlaylistSong(entity1, entity2);
        const compareResult2 = service.comparePlaylistSong(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15074 };
        const entity2 = { id: 21492 };

        const compareResult1 = service.comparePlaylistSong(entity1, entity2);
        const compareResult2 = service.comparePlaylistSong(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15074 };
        const entity2 = { id: 15074 };

        const compareResult1 = service.comparePlaylistSong(entity1, entity2);
        const compareResult2 = service.comparePlaylistSong(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
