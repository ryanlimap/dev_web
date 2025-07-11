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
  constructor(
    private playerService: PlayerService,
  ) {}
}
