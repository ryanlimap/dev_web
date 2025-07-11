import { Component } from '@angular/core';
import { SideBarComponent } from '../common/side-bar/side-bar.component';
import { HeaderComponent } from '../common/header/header.component';
import { MusicsCardComponent } from '../common/musics-card/musics-card.component';
import { PlayBarComponent } from '../common/play-bar/play-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    SideBarComponent,
    HeaderComponent,
    MusicsCardComponent,
    PlayBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  musicas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any>('http://localhost:5000/api/spotify/search?q=pop')
      .subscribe(data => {
        this.musicas = data.tracks.items;
      });
  }
}
