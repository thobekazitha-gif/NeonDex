import { Injectable, signal, computed } from '@angular/core';

export interface FavoritePokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  addedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'pokemon_favorites';
  
  // Signal to hold favorites
  private favoritesSignal = signal<FavoritePokemon[]>(this.loadFromStorage());

  // Computed signal for favorites list
  favorites = computed(() => this.favoritesSignal());

  // Computed signal for favorites count
  favoritesCount = computed(() => this.favoritesSignal().length);

  // Computed signal to check if a Pokemon is favorited
  isFavorite(pokemonId: number): boolean {
    return this.favoritesSignal().some(fav => fav.id === pokemonId);
  }

  // Add a Pokemon to favorites
  addFavorite(pokemon: FavoritePokemon): void {
    const current = this.favoritesSignal();
    
    // Check if already in favorites
    if (current.some(fav => fav.id === pokemon.id)) {
      return;
    }

    const updated = [...current, { ...pokemon, addedAt: Date.now() }];
    this.favoritesSignal.set(updated);
    this.saveToStorage(updated);
  }

  // Remove a Pokemon from favorites
  removeFavorite(pokemonId: number): void {
    const current = this.favoritesSignal();
    const updated = current.filter(fav => fav.id !== pokemonId);
    this.favoritesSignal.set(updated);
    this.saveToStorage(updated);
  }

  // Toggle favorite status
  toggleFavorite(pokemon: FavoritePokemon): void {
    if (this.isFavorite(pokemon.id)) {
      this.removeFavorite(pokemon.id);
    } else {
      this.addFavorite(pokemon);
    }
  }

  // Clear all favorites
  clearAllFavorites(): void {
    this.favoritesSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get favorites sorted by date added (newest first)
  getFavoritesSortedByDate(): FavoritePokemon[] {
    return [...this.favoritesSignal()].sort((a, b) => b.addedAt - a.addedAt);
  }

  // Get favorites sorted by name
  getFavoritesSortedByName(): FavoritePokemon[] {
    return [...this.favoritesSignal()].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get favorites sorted by ID
  getFavoritesSortedById(): FavoritePokemon[] {
    return [...this.favoritesSignal()].sort((a, b) => a.id - b.id);
  }

  // Private: Load from localStorage
  private loadFromStorage(): FavoritePokemon[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  // Private: Save to localStorage
  private saveToStorage(favorites: FavoritePokemon[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}