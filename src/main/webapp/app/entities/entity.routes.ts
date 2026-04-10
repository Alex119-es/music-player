import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'musicPlayerApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'genre',
    data: { pageTitle: 'musicPlayerApp.genre.home.title' },
    loadChildren: () => import('./genre/genre.routes'),
  },
  {
    path: 'artist',
    data: { pageTitle: 'musicPlayerApp.artist.home.title' },
    loadChildren: () => import('./artist/artist.routes'),
  },
  {
    path: 'album',
    data: { pageTitle: 'musicPlayerApp.album.home.title' },
    loadChildren: () => import('./album/album.routes'),
  },
  {
    path: 'song',
    data: { pageTitle: 'musicPlayerApp.song.home.title' },
    loadChildren: () => import('./song/song.routes'),
  },
  {
    path: 'playlist',
    data: { pageTitle: 'musicPlayerApp.playlist.home.title' },
    loadChildren: () => import('./playlist/playlist.routes'),
  },
  {
    path: 'playlist-song',
    data: { pageTitle: 'musicPlayerApp.playlistSong.home.title' },
    loadChildren: () => import('./playlist-song/playlist-song.routes'),
  },
  {
    path: 'play',
    data: { pageTitle: 'musicPlayerApp.play.home.title' },
    loadChildren: () => import('./play/play.routes'),
  },
  {
    path: 'like',
    data: { pageTitle: 'musicPlayerApp.like.home.title' },
    loadChildren: () => import('./like/like.routes'),
  },
  {
    path: 'user-management',
    data: { pageTitle: 'userManagement.home.title' },
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
