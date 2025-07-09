import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Autenticando com Spotify...</p>`
})
export class CallbackComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const verifier = localStorage.getItem('code_verifier');

    if (!code || !verifier) {
      // Se não tem código, já redirecione para home, ou outra página padrão
      this.router.navigate(['/home']);
      return;
    }

    try {
      const body = new URLSearchParams({
        client_id: '82476fd362a1489f8e0ecfb512fcdb83',
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://127.0.0.1:4200/callback',
        code_verifier: verifier
      });

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem('spotify_token', data.access_token);

        // Remove o parâmetro 'code' da URL para não ficar em loop
        window.history.replaceState({}, document.title, '/callback');

        // Redireciona para home
        this.router.navigate(['/home']);
      } else {
        // Tratar erro, redirecionar ou exibir mensagem
        this.router.navigate(['/login']);
      }
    } catch (error) {
      // Tratar erro da requisição
      this.router.navigate(['/login']);
    }
  }
}
