import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Autenticando com Spotify...</p>`
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_refresh_token', refreshToken || '');
      localStorage.setItem('spotify_token_expires_in', expiresIn || '');
      // Limpa a URL para não ficar com tokens visíveis
      window.history.replaceState({}, document.title, '/callback');

      // Redireciona para a home/dashboard
      this.router.navigate(['/home']);
    } else {
      // Trate erro ou redirecione para login
      this.router.navigate(['/login']);
    }
  }
}
