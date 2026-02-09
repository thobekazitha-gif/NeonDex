import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PokemonCardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './pokemon-list.component.html'
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  pokemonList = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchQuery = '';
  offset = signal(0);
  limit = 20;

  constructor() {
    effect(() => {
      this.loadPokemon();
    });
  }

  loadPokemon() {
    this.loading.set(true);
    this.error.set(null);
    this.pokemonService.getPokemonList(this.limit, this.offset()).subscribe({
      next: (res) => {
        this.pokemonList.set(res.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load Pokémon list');
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    this.offset.update(v => v + this.limit);
  }

  prevPage() {
    if (this.offset() > 0) this.offset.update(v => Math.max(0, v - this.limit));
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/pokemon', this.searchQuery.trim().toLowerCase()]);
    }
  }
}