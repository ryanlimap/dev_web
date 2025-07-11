import { Component } from '@angular/core';
import { PlayerService } from '../../../services/spotify/player/player.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-play-bar',
  imports: [CommonModule],
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.css'],
})
export class PlayBarComponent {
  isPlaying = false; // estado atual

  constructor(
    private playerService: PlayerService,
    private http: HttpClient
  ) {}

  togglePlay() {
    const access_token = localStorage.getItem('spotify_access_token');

    if (!access_token) {
      console.error('❌ Token não encontrado');
      return;
    }

    this.http.get<any>('http://localhost:5000/api/spotify/devices', {
      headers: { Authorization: `Bearer ${access_token}` }
    }).subscribe({
      next: (res) => {
        const device = res.devices?.[0];
        if (!device) {
          console.error('Nenhum device ativo encontrado.');
          return;
        }

        const device_id = device.id;

        if (this.isPlaying) {
          // ⏸️ PAUSE
          this.http.put('http://localhost:5000/api/spotify/pause',
            { device_id },
            {
              headers: { Authorization: `Bearer ${access_token}` }
            }
          ).subscribe({
            next: () => {
              console.log('⏸️ Pausado');
              this.isPlaying = false;
            },
            error: (err) => console.error('Erro ao pausar:', err)
          });
        } else {
          // ▶️ PLAY
          const trackUri = 'spotify:track:4cOdK2wGLETKBW3PvgPWqT'; // Rickroll

          this.http.post('http://localhost:5000/api/spotify/play', {
            access_token,
            uris: trackUri,
            device_id
          }).subscribe({
            next: () => {
              console.log('▶️ Tocando');
              this.isPlaying = true;
            },
            error: (err) => console.error('Erro ao tocar:', err)
          });
        }
      },
      error: (err) => console.error('Erro ao buscar devices:', err)
    });
  }

  // play() {
  //   const access_token = localStorage.getItem('spotify_access_token');
  //   const trackUri = 'spotify:track:4cOdK2wGLETKBW3PvgPWqT'; // Rickroll

  //   this.http.get<any>('http://localhost:5000/api/spotify/devices', {
  //     headers: { Authorization: `Bearer ${access_token}` }
  //   }).subscribe({
  //     next: (res) => {
  //       const device = res.devices?.[0];
  //       if (!device) {
  //         console.error('Nenhum device ativo encontrado.');
  //         return;
  //       }

  //       const device_id = device.id;

  //       this.http.post('http://localhost:5000/api/spotify/play', {
  //         access_token,
  //         uris: trackUri,
  //         device_id
  //       }).subscribe({
  //         next: () => console.log('🎶 Tocando!'),
  //         error: (err) => console.error('Erro ao tocar:', err)
  //       });
  //     },
  //     error: (err) => console.error('Erro ao buscar devices:', err)
  //   });
  // }
}
