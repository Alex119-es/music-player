import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPlay } from '../play.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../play.test-samples';

import { PlayService, RestPlay } from './play.service';

const requireRestSample: RestPlay = {
  ...sampleWithRequiredData,
  playedAt: sampleWithRequiredData.playedAt?.toJSON(),
};

describe('Play Service', () => {
  let service: PlayService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlay | IPlay[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlayService);
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

    it('should create a Play', () => {
      const play = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(play).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Play', () => {
      const play = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(play).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Play', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Play', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Play', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addPlayToCollectionIfMissing', () => {
      it('should add a Play to an empty array', () => {
        const play: IPlay = sampleWithRequiredData;
        expectedResult = service.addPlayToCollectionIfMissing([], play);
        expect(expectedResult).toEqual([play]);
      });

      it('should not add a Play to an array that contains it', () => {
        const play: IPlay = sampleWithRequiredData;
        const playCollection: IPlay[] = [
          {
            ...play,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlayToCollectionIfMissing(playCollection, play);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Play to an array that doesn't contain it", () => {
        const play: IPlay = sampleWithRequiredData;
        const playCollection: IPlay[] = [sampleWithPartialData];
        expectedResult = service.addPlayToCollectionIfMissing(playCollection, play);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(play);
      });

      it('should add only unique Play to an array', () => {
        const playArray: IPlay[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const playCollection: IPlay[] = [sampleWithRequiredData];
        expectedResult = service.addPlayToCollectionIfMissing(playCollection, ...playArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const play: IPlay = sampleWithRequiredData;
        const play2: IPlay = sampleWithPartialData;
        expectedResult = service.addPlayToCollectionIfMissing([], play, play2);
        expect(expectedResult).toEqual([play, play2]);
      });

      it('should accept null and undefined values', () => {
        const play: IPlay = sampleWithRequiredData;
        expectedResult = service.addPlayToCollectionIfMissing([], null, play, undefined);
        expect(expectedResult).toEqual([play]);
      });

      it('should return initial array if no Play is added', () => {
        const playCollection: IPlay[] = [sampleWithRequiredData];
        expectedResult = service.addPlayToCollectionIfMissing(playCollection, undefined, null);
        expect(expectedResult).toEqual(playCollection);
      });
    });

    describe('comparePlay', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlay(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15119 };
        const entity2 = null;

        const compareResult1 = service.comparePlay(entity1, entity2);
        const compareResult2 = service.comparePlay(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15119 };
        const entity2 = { id: 30254 };

        const compareResult1 = service.comparePlay(entity1, entity2);
        const compareResult2 = service.comparePlay(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15119 };
        const entity2 = { id: 15119 };

        const compareResult1 = service.comparePlay(entity1, entity2);
        const compareResult2 = service.comparePlay(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
