import { Injectable } from '@angular/core';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  player: any;

  initPlayer(accessToken: string) {
    return new Promise<void>((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = accessToken;

        this.player = new window.Spotify.Player({
          name: 'Angular Spotify Player',
          getOAuthToken: (cb: any) => cb(token),
          volume: 0.8,
        });

        // Erros
        this.player.addListener('initialization_error', ({ message }: any) =>
          console.error(message),
        );
        this.player.addListener('authentication_error', ({ message }: any) =>
          console.error(message),
        );
        this.player.addListener('account_error', ({ message }: any) => console.error(message));
        this.player.addListener('playback_error', ({ message }: any) => console.error(message));

        // Ready
        this.player.addListener('ready', ({ device_id }: any) => {
          console.log('Player ready with device ID', device_id);
          this.transferPlayback(device_id, token);
          resolve();
        });

        this.player.connect();
      };
    });
  }

  private transferPlayback(deviceId: string, token: string) {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });
  }

  playTrack(uris: string[], token: string) {
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ uris }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  pauseTrack() {
    if (this.player) {
      this.player.pause();
    }
  }

  togglePlayback() {
    this.player.getCurrentState().then((state: any) => {
      if (!state) return;
      if (state.paused) {
        this.player.resume();
      } else {
        this.player.pause();
      }
    });
  }

  getCurrentState(): Promise<any> {
    if (!this.player) return Promise.resolve(null);
    return this.player.getCurrentState();
  }

  nextTrack(token: string) {
    return fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  previousTrack(token: string) {
    return fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  setVolume(volume: number) {
    if (!this.player) return;
    this.player
      .setVolume(volume)
      .catch((err: any) => console.error('Erro ao definir volume:', err));
  }
}
