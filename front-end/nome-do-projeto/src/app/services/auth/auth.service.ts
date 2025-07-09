import { Injectable } from '@angular/core';
import { generatePKCE } from '../../../utils/pkce-util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  clientId = '82476fd362a1489f8e0ecfb512fcdb83';
  redirectUri = 'http://127.0.0.1:4200/callback';
  scopes = [
    'user-read-private',
    'user-read-email',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state'
  ];

  async login() {
    const { codeVerifier, codeChallenge } = await generatePKCE();

    localStorage.setItem('code_verifier', codeVerifier);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      redirect_uri: this.redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location.href = `https://accounts.spotify.com/authorize?${args.toString()}`;
  }

  async getToken(): Promise<string | null> {
  // Primeiro, tenta pegar token já salvo e válido (implemente sua validade)
  const token = localStorage.getItem('spotify_token');
  if (token) {
    return token;
  }

  // Se não tem token, tenta pegar código da URL
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) {
    // Se não tem código, precisa logar (redirecionar para login)
    await this.login();
    return null; // login fará redirecionamento
  }

  // Pega code_verifier para trocar o code pelo token
  const verifier = localStorage.getItem('code_verifier');
  if (!verifier) {
    // Sem verifier não tem como trocar, força login
    await this.login();
    return null;
  }

  // Faz o POST para trocar o código pelo token
  const body = new URLSearchParams({
    client_id: this.clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: this.redirectUri,
    code_verifier: verifier
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) {
    // Se der erro na troca, tenta login de novo
    await this.login();
    return null;
  }

  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem('spotify_token', data.access_token);
    // Limpa o código da URL para evitar loop
    window.history.replaceState({}, document.title, this.redirectUri);
    return data.access_token;
  }

  // Se não tiver token no response, força login
  await this.login();
  return null;
}

}
