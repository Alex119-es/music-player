import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IPlay } from '../play.model';
import { PlayService } from '../service/play.service';

const playResolve = (route: ActivatedRouteSnapshot): Observable<null | IPlay> => {
  const id = route.params.id;
  if (id) {
    const router = inject(Router);
    const service = inject(PlayService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default playResolve;
