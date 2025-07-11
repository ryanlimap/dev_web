import { Component } from '@angular/core';
import { PlayerService } from '../../../services/spotify/player/player.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-bar',
  imports: [CommonModule],
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.css'],
})
export class PlayBarComponent {
  constructor(
    private playerService: PlayerService,
    private auth: AuthService,
  ) {}

  isPaused = true;
  progress = 0; // ms
  duration = 0; // ms
  intervalId: any;

  async ngOnInit() {
    const token = await this.auth.getToken();
    if (token) {
      await this.playerService.initPlayer(token);
    }
  }

  async play() {
    const token = await this.auth.getToken();
    const uris = ['spotify:track:20OB6MzHqP6Oc9xTfWxIT8']; // Exemplo
    if (token) {
      this.playerService.playTrack(uris, token);
      this.startProgressPolling();
      this.isPaused = false; // já sabe que está tocando
    }
  }

  async togglePlayPause() {
    const state = await this.playerService.getCurrentState();
    if (!state) {
      // Se ainda não tem música, chama play primeiro
      await this.play();
      return;
    }

    this.playerService.togglePlayback();
    this.isPaused = !this.isPaused;
  }

  async next() {
    const token = await this.auth.getToken();
    if (token) {
      await this.playerService.nextTrack(token);
    }
  }

  async previous() {
    const token = await this.auth.getToken();
    if (token) {
      await this.playerService.previousTrack(token);
    }
  }

  startProgressPolling() {
    this.intervalId = setInterval(async () => {
      const state = await this.playerService.getCurrentState();
      if (state) {
        this.progress = state.position;
        this.duration = state.duration;
        this.isPaused = state.paused;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  onSeekChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value; // converte pra número
    this.seek(value);
  }

  async seek(positionMs: number) {
    if (!this.playerService.player) return;

    await this.playerService.player.seek(positionMs);
    this.progress = positionMs;
  }

  onVolumeChange(event: Event) {
    const volume = +(event.target as HTMLInputElement).value;
    this.playerService.setVolume(volume);
  }
}
