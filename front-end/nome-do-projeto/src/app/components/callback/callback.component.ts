import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Autenticando com Spotify...</p>`
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

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
      console.log('aqui')
      this.router.navigate(['/home']);
    } else {
      // Trate erro ou redirecione para login
      this.router.navigate(['/login']);
    }
  }
}
