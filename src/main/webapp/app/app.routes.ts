import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/shared/jhipster/constants';

import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.default),
    pathMatch: 'full',
  },
  {
    path: 'dashboard-editor',
    loadComponent: () => import('./home/dashboard-editor/dashboard-editor').then(m => m.default),
    data: {
      authorities: [Authority.ADMIN, Authority.EDITOR, Authority.ARTIST],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'dashboard-user',
    loadComponent: () => import('./home/dashboard-user/dashboard-user').then(m => m.default),
    data: {
      authorities: [Authority.USER],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar').then(m => m.Navbar),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login'),
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import('./entities/entity.routes'),
  },
  ...errorRoute,
];

export default routes;
