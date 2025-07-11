import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-musics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './musics-card.component.html',
  styleUrls: ['./musics-card.component.scss']
})
export class MusicsCardComponent {
  @Input() title: string = '';
  @Input() artist: string = '';
  @Input() image: string = '';
  @Input() preview: string = '';
}
