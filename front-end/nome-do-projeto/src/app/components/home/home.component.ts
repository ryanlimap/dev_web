import { Component } from '@angular/core';
import { SideBarComponent } from '../common/side-bar/side-bar.component';
import { HeaderComponent } from '../common/header/header.component';
import { MusicsCardComponent } from '../common/musics-card/musics-card.component';
import { HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SideBarComponent,
    HeaderComponent,
    MusicsCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  musicas: any[] = [];
  isLoading = true;
  error: string | null = null;

  // Lista de gêneros e termos para busca aleatória
  private searchTerms = [
    'pop', 'rock', 'jazz', 'classical', 'electronic', 'hip hop', 
    'country', 'blues', 'reggae', 'folk', 'indie', 'alternative',
    'latin', 'world', 'funk', 'soul', 'disco', 'house', 'techno',
    'ambient', 'new age', 'gospel', 'r&b', 'punk', 'metal'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRandomMusics();
  }

  loadRandomMusics(): void {
    this.isLoading = true;
    this.error = null;
    
    // Seleciona um termo aleatório da lista
    const randomTerm = this.getRandomSearchTerm();
    
    // Gera um offset aleatório para variar os resultados
    const randomOffset = Math.floor(Math.random() * 100);
    
    const searchUrl = `http://localhost:3000/api/spotify/search?q=${randomTerm}&offset=${randomOffset}&limit=20`;
    
    console.log('🔍 Buscando músicas:', { randomTerm, randomOffset, searchUrl });
    
    this.http.get<any>(searchUrl).subscribe({
      next: (data) => {
        console.log('✅ Resposta da API:', data);
        
        if (data && data.tracks && data.tracks.items) {
          // Filtra apenas músicas com preview e shuffla a lista - TEMPORARIAMENTE REMOVIDO O FILTRO
          // const musicasComPreview = data.tracks.items.filter((track: any) => track.preview_url);
          this.musicas = this.shuffleArray(data.tracks.items); // Aceita todas as músicas
          
          console.log(`🎵 Encontradas ${this.musicas.length} músicas (preview removido temporariamente)`);
          
          // Se não encontrou músicas, tenta um termo diferente
          if (this.musicas.length === 0) {
            console.log('⚠️ Nenhuma música encontrada, tentando novamente...');
            this.loadRandomMusics();
            return;
          }
        } else {
          console.log('⚠️ Resposta da API não contém dados de tracks');
          this.musicas = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar músicas:', error);
        this.error = 'Erro ao carregar músicas. Tente novamente.';
        this.isLoading = false;
        
        // Em caso de erro, carrega músicas básicas
        this.loadFallbackMusics();
      }
    });
  }

  private getRandomSearchTerm(): string {
    const randomIndex = Math.floor(Math.random() * this.searchTerms.length);
    return this.searchTerms[randomIndex];
  }

  private shuffleArray(array: any[]): any[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private loadFallbackMusics(): void {
    // Carrega músicas pop como fallback
    this.http.get<any>('http://localhost:5000/api/spotify/search?q=pop&limit=10').subscribe({
      next: (data) => {
        this.musicas = data?.tracks?.items || [];
        this.isLoading = false;
      },
      error: () => {
        this.musicas = [];
        this.isLoading = false;
      }
    });
  }

  // Método para recarregar músicas aleatórias
  refreshMusics(): void {
    this.loadRandomMusics();
  }

  // TrackBy function para melhor performance no *ngFor
  trackByMusicId(index: number, musica: any): string {
    return musica?.id || index;
  }
}
