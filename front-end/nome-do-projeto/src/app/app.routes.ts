import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Página inicial
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent}
];
