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
  // styleUrls: []   ← usually not needed if you have global styles
})
export class PokemonComparisonComponent {
  private pokemonService = inject(PokemonService);

  searchA    = signal<string>('');
  searchB    = signal<string>('');
  pokemonA   = signal<any | null>(null);
  pokemonB   = signal<any | null>(null);
  loadingA   = signal<boolean>(false);
  loadingB   = signal<boolean>(false);
  error      = signal<string | null>(null);

  result = computed(() => {
    const a = this.pokemonA();
    const b = this.pokemonB();
    if (!a || !b) return null;
    return this.pokemonService.simulateBattle(a, b);
  });

  loadPokemon(name: string, side: 'A' | 'B') {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    const loading = side === 'A' ? this.loadingA : this.loadingB;
    loading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonDetail(trimmed).subscribe({
      next: (data) => {
        if (side === 'A') this.pokemonA.set(data);
        else              this.pokemonB.set(data);
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

    const sa = this.searchA();
    const sb = this.searchB();
    this.searchA.set(sb);
    this.searchB.set(sa);
  }

  clear() {
    this.searchA.set('');
    this.searchB.set('');
    this.pokemonA.set(null);
    this.pokemonB.set(null);
    this.error.set(null);
  }
}