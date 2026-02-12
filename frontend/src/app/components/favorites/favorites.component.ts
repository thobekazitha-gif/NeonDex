import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);

  // Sort options
  sortBy = signal<'date' | 'name' | 'id'>('date');

  // Get favorites based on sort option
  favorites = computed(() => {
    const sort = this.sortBy();
    switch (sort) {
      case 'date':
        return this.favoritesService.getFavoritesSortedByDate();
      case 'name':
        return this.favoritesService.getFavoritesSortedByName();
      case 'id':
        return this.favoritesService.getFavoritesSortedById();
      default:
        return this.favoritesService.favorites();
    }
  });

  // Get favorites count
  favoritesCount = this.favoritesService.favoritesCount;

  // Group favorites by type
  favoritesByType = computed(() => {
    const favs = this.favorites();
    const grouped: { [key: string]: any[] } = {};
    
    favs.forEach(pokemon => {
      pokemon.types.forEach(type => {
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(pokemon);
      });
    });
    
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)) as [string, any[]][];
  });

  // Set sort option
  setSortBy(sort: 'date' | 'name' | 'id'): void {
    this.sortBy.set(sort);
  }

  // Remove from favorites
  removeFavorite(pokemonId: number): void {
    this.favoritesService.removeFavorite(pokemonId);
  }

  // Clear all favorites
  clearAll(): void {
    if (confirm('Are you sure you want to remove all favorites?')) {
      this.favoritesService.clearAllFavorites();
    }
  }

  // Get type color class
  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    return typeColors[type] || 'bg-gray-400';
  }
}
