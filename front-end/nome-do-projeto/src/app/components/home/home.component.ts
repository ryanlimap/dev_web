import { Component } from '@angular/core';
import { SideBarComponent } from '../common/side-bar/side-bar.component';
import { HeaderComponent } from '../common/header/header.component';
import { MusicsCardComponent } from '../common/musics-card/musics-card.component';
import { PlayBarComponent } from '../common/play-bar/play-bar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    SideBarComponent,
    HeaderComponent,
    MusicsCardComponent,
    PlayBarComponent],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
