import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchEvent.emit(this.searchTerm.trim());
    }
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchEvent.emit(''); // Emit empty string to show random music again
  }
}
