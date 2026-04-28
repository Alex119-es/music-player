import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/shared/jhipster/constants';

import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar'),
    outlet: 'navbar',
  },
  {
    path: 'dashboard-editor',
    loadComponent: () => import('./dashboard-editor/dashboard-editor'),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Panel Editor',
  },
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./dashboard-admin/dashboard-admin'),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.ADMIN] },
    title: 'Panel Administrador',
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
