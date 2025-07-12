import { Component, OnInit } from '@angular/core';
import { PlayBarComponent } from '../common/play-bar/play-bar.component';
import { HeaderComponent } from '../common/header/header.component';
import { SideBarComponent } from '../common/side-bar/side-bar.component';
import { MusicsCardComponent } from '../common/musics-card/musics-card.component';

@Component({
  selector: 'app-playlist1',
  imports: [
      SideBarComponent,
      HeaderComponent,
      MusicsCardComponent,
      PlayBarComponent],
  
  templateUrl: './playlist1.component.html',
  styleUrls: ['./playlist1.component.css']
})
export class Playlist1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
