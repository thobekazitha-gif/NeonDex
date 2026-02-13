import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-pokemon-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './pokemon-comparison.html',
  // styleUrls removed - file does not exist, and it's optional
})
export class PokemonComparisonComponent {
  private pokemonService = inject(PokemonService);

  searchA = signal<string>('');
  searchB = signal<string>('');
  pokemonA = signal<any | null>(null);
  pokemonB = signal<any | null>(null);
  loadingA = signal(false);
  loadingB = signal(false);
  error = signal<string | null>(null);

  result = computed(() => {
    const a = this.pokemonA();
    const b = this.pokemonB();
    if (!a || !b) return null;
    return this.pokemonService.simulateBattle(a, b);
  });

  loadPokemon(name: string, side: 'A' | 'B') {
    if (!name.trim()) return;

    const loading = side === 'A' ? this.loadingA : this.loadingB;
    loading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonDetail(name.toLowerCase()).subscribe({
      next: (data) => {
        if (side === 'A') this.pokemonA.set(data);
        else this.pokemonB.set(data);
        loading.set(false);
      },
      error: () => {
        this.error.set(`Pokémon "${name}" not found. Check spelling.`);
        loading.set(false);
      }
    });
  }

  swapPokemon() {
    const a = this.pokemonA();
    const b = this.pokemonB();
    this.pokemonA.set(b);
    this.pokemonB.set(a);

    const searchA = this.searchA();
    const searchB = this.searchB();
    this.searchA.set(searchB);
    this.searchB.set(searchA);
  }

  clear() {
    this.searchA.set('');
    this.searchB.set('');
    this.pokemonA.set(null);
    this.pokemonB.set(null);
    this.error.set(null);
  }
}