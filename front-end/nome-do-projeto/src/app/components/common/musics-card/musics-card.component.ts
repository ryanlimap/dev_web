import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-musics-card',
  templateUrl: './musics-card.component.html',
  styleUrls: ['./musics-card.component.scss']
})
export class MusicsCardComponent {
  @Input() title: string = '';
  @Input() artist: string = '';
  @Input() image: string = '';
  @Input() preview: string = '';
}
