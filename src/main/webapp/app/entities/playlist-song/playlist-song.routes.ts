import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import PlaylistSongResolve from './route/playlist-song-routing-resolve.service';

const playlistSongRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/playlist-song').then(m => m.PlaylistSong),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/playlist-song-detail').then(m => m.PlaylistSongDetail),
    resolve: {
      playlistSong: PlaylistSongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/playlist-song-update').then(m => m.PlaylistSongUpdate),
    resolve: {
      playlistSong: PlaylistSongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/playlist-song-update').then(m => m.PlaylistSongUpdate),
    resolve: {
      playlistSong: PlaylistSongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default playlistSongRoute;
