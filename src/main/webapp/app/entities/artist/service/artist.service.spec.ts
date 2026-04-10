import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IArtist } from '../artist.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../artist.test-samples';

import { ArtistService, RestArtist } from './artist.service';

const requireRestSample: RestArtist = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('Artist Service', () => {
  let service: ArtistService;
  let httpMock: HttpTestingController;
  let expectedResult: IArtist | IArtist[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ArtistService);
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

    it('should create a Artist', () => {
      const artist = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(artist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Artist', () => {
      const artist = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(artist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Artist', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Artist', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Artist', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addArtistToCollectionIfMissing', () => {
      it('should add a Artist to an empty array', () => {
        const artist: IArtist = sampleWithRequiredData;
        expectedResult = service.addArtistToCollectionIfMissing([], artist);
        expect(expectedResult).toEqual([artist]);
      });

      it('should not add a Artist to an array that contains it', () => {
        const artist: IArtist = sampleWithRequiredData;
        const artistCollection: IArtist[] = [
          {
            ...artist,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addArtistToCollectionIfMissing(artistCollection, artist);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Artist to an array that doesn't contain it", () => {
        const artist: IArtist = sampleWithRequiredData;
        const artistCollection: IArtist[] = [sampleWithPartialData];
        expectedResult = service.addArtistToCollectionIfMissing(artistCollection, artist);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(artist);
      });

      it('should add only unique Artist to an array', () => {
        const artistArray: IArtist[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const artistCollection: IArtist[] = [sampleWithRequiredData];
        expectedResult = service.addArtistToCollectionIfMissing(artistCollection, ...artistArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const artist: IArtist = sampleWithRequiredData;
        const artist2: IArtist = sampleWithPartialData;
        expectedResult = service.addArtistToCollectionIfMissing([], artist, artist2);
        expect(expectedResult).toEqual([artist, artist2]);
      });

      it('should accept null and undefined values', () => {
        const artist: IArtist = sampleWithRequiredData;
        expectedResult = service.addArtistToCollectionIfMissing([], null, artist, undefined);
        expect(expectedResult).toEqual([artist]);
      });

      it('should return initial array if no Artist is added', () => {
        const artistCollection: IArtist[] = [sampleWithRequiredData];
        expectedResult = service.addArtistToCollectionIfMissing(artistCollection, undefined, null);
        expect(expectedResult).toEqual(artistCollection);
      });
    });

    describe('compareArtist', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareArtist(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 5568 };
        const entity2 = null;

        const compareResult1 = service.compareArtist(entity1, entity2);
        const compareResult2 = service.compareArtist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 5568 };
        const entity2 = { id: 18977 };

        const compareResult1 = service.compareArtist(entity1, entity2);
        const compareResult2 = service.compareArtist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 5568 };
        const entity2 = { id: 5568 };

        const compareResult1 = service.compareArtist(entity1, entity2);
        const compareResult2 = service.compareArtist(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
