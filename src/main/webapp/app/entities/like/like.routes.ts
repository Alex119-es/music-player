import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import LikeResolve from './route/like-routing-resolve.service';

const likeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/like').then(m => m.Like),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/like-detail').then(m => m.LikeDetail),
    resolve: {
      like: LikeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/like-update').then(m => m.LikeUpdate),
    resolve: {
      like: LikeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/like-update').then(m => m.LikeUpdate),
    resolve: {
      like: LikeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default likeRoute;
