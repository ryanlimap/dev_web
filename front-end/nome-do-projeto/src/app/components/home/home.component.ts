import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { HeaderComponent } from '../header/header.component';
import { MusicsCardComponent } from '../musics-card/musics-card.component';
import { PlayBarComponent } from '../play-bar/play-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SideBarComponent,
    HeaderComponent,
    MusicsCardComponent,
    PlayBarComponent],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
