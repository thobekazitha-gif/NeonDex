import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService, FavoritePokemon } from '../../services/favorites.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleFavorite($event)"
      [class]="'p-3 rounded-full transition-all transform hover:scale-110 ' + buttonClass"
      [title]="isFavorite ? 'Remove from favorites' : 'Add to favorites'">
      
      @if (isFavorite) {
        <!-- Filled Heart (Favorite) -->
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
      } @else {
        <!-- Outline Heart (Not Favorite) -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
    </button>
  `,
  styles: [`
    button {
      animation: heartbeat 0.3s ease-in-out;
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    button:active {
      animation: heartPop 0.3s ease-in-out;
    }

    @keyframes heartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `]
})
export class FavoriteButtonComponent {
  private favoritesService = inject(FavoritesService);

  @Input({ required: true }) pokemon!: FavoritePokemon;
  @Input() buttonClass: string = 'bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400';

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.pokemon.id);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.pokemon);
  }
}