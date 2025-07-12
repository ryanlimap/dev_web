import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { Playlist1Component } from './components/playlist1/playlist1.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Página inicial
  { path: 'login', component: LoginComponent},
  { path: 'callback', component: CallbackComponent },
  { path: 'home', component: HomeComponent},
  { path: 'playlist', component: PlaylistComponent},
  { path: 'playlist/1', component: Playlist1Component},
];
