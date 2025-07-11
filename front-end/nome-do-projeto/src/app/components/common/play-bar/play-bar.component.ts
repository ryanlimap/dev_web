import { Component } from '@angular/core';
import { PlayerService } from '../../../services/spotify/player/player.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-bar',
  imports: [CommonModule],
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.css'],
})
export class PlayBarComponent {
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
}
