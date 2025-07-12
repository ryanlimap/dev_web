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
<<<<<<< HEAD
  playlist: string[] = [];
  currentTrackIndex = 0;
  isPlaying = false;
  volume = 0.8;
  progress = 0;
  duration = 0;
  newTrackUrl = '';

  constructor(private playerService: PlayerService) {}

  addTrack() {
    if (this.newTrackUrl) {
      this.playlist.push(this.newTrackUrl);
      this.newTrackUrl = '';
    }
  }

  playTrack(index: number) {
    this.currentTrackIndex = index;
    this.isPlaying = true;
    // Aqui você pode chamar o playerService para tocar a música
    // Exemplo: this.playerService.playTrack([this.playlist[index]], token);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    // Chame o serviço para pausar ou tocar
    // Exemplo: this.playerService.togglePlayback();
  }

  onTimeUpdate(event: any) {
    this.progress = event.target.currentTime;
    this.duration = event.target.duration;
  }

  seek(event: any) {
    // Implementar seek usando o serviço se possível
    // Exemplo: this.playerService.seek(event.target.value);
  }

  setVolume(event: any) {
    this.volume = event.target.value;
    this.playerService.setVolume(this.volume);
  }

  nextTrack() {
    if (this.currentTrackIndex < this.playlist.length - 1) {
      this.playTrack(this.currentTrackIndex + 1);
    }
  }

  prevTrack() {
    if (this.currentTrackIndex > 0) {
      this.playTrack(this.currentTrackIndex - 1);
    }
  }
=======
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
>>>>>>> 41e1f81dda49dd5fa91a9766d7ddb9358e314078
}
