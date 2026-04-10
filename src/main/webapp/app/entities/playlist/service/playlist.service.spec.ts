import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPlaylist } from '../playlist.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../playlist.test-samples';

import { PlaylistService, RestPlaylist } from './playlist.service';

const requireRestSample: RestPlaylist = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Playlist Service', () => {
  let service: PlaylistService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlaylist | IPlaylist[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlaylistService);
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

    it('should create a Playlist', () => {
      const playlist = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(playlist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Playlist', () => {
      const playlist = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(playlist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Playlist', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Playlist', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Playlist', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addPlaylistToCollectionIfMissing', () => {
      it('should add a Playlist to an empty array', () => {
        const playlist: IPlaylist = sampleWithRequiredData;
        expectedResult = service.addPlaylistToCollectionIfMissing([], playlist);
        expect(expectedResult).toEqual([playlist]);
      });

      it('should not add a Playlist to an array that contains it', () => {
        const playlist: IPlaylist = sampleWithRequiredData;
        const playlistCollection: IPlaylist[] = [
          {
            ...playlist,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlaylistToCollectionIfMissing(playlistCollection, playlist);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Playlist to an array that doesn't contain it", () => {
        const playlist: IPlaylist = sampleWithRequiredData;
        const playlistCollection: IPlaylist[] = [sampleWithPartialData];
        expectedResult = service.addPlaylistToCollectionIfMissing(playlistCollection, playlist);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(playlist);
      });

      it('should add only unique Playlist to an array', () => {
        const playlistArray: IPlaylist[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const playlistCollection: IPlaylist[] = [sampleWithRequiredData];
        expectedResult = service.addPlaylistToCollectionIfMissing(playlistCollection, ...playlistArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const playlist: IPlaylist = sampleWithRequiredData;
        const playlist2: IPlaylist = sampleWithPartialData;
        expectedResult = service.addPlaylistToCollectionIfMissing([], playlist, playlist2);
        expect(expectedResult).toEqual([playlist, playlist2]);
      });

      it('should accept null and undefined values', () => {
        const playlist: IPlaylist = sampleWithRequiredData;
        expectedResult = service.addPlaylistToCollectionIfMissing([], null, playlist, undefined);
        expect(expectedResult).toEqual([playlist]);
      });

      it('should return initial array if no Playlist is added', () => {
        const playlistCollection: IPlaylist[] = [sampleWithRequiredData];
        expectedResult = service.addPlaylistToCollectionIfMissing(playlistCollection, undefined, null);
        expect(expectedResult).toEqual(playlistCollection);
      });
    });

    describe('comparePlaylist', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlaylist(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 26585 };
        const entity2 = null;

        const compareResult1 = service.comparePlaylist(entity1, entity2);
        const compareResult2 = service.comparePlaylist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 26585 };
        const entity2 = { id: 6730 };

        const compareResult1 = service.comparePlaylist(entity1, entity2);
        const compareResult2 = service.comparePlaylist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 26585 };
        const entity2 = { id: 26585 };

        const compareResult1 = service.comparePlaylist(entity1, entity2);
        const compareResult2 = service.comparePlaylist(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
