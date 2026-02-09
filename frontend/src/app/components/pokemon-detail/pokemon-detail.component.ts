import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './pokemon-detail.component.html'
})
export class PokemonDetailComponent {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  pokemon = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) this.loadDetail(name);
  }

  loadDetail(name: string) {
    this.loading.set(true);
    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (data) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error || 'Failed to load Pokémon');
        this.loading.set(false);
      }
    });
  }

  getStatPercentage(base: number): string {
    return `${Math.min((base / 255) * 100, 100)}%`;
  }
}