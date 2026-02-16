import { Component, inject, input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButtonComponent],
  templateUrl: './pokemon-card.component.html'
})
export class PokemonCardComponent implements OnInit {
  pokemon = input.required<any>();
  private pokemonService = inject(PokemonService);

  pokemonDetail = signal<any>(null);
  loading = signal<boolean>(true);

  // Convert Pokemon data to FavoritePokemon format
  favoritePokemon = computed(() => {
    const detail = this.pokemonDetail();
    if (!detail) return null;

    return {
      id: detail.id,
      name: detail.name,
      imageUrl: detail.sprites?.other?.['official-artwork']?.front_default ||
                detail.sprites?.front_default ||
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
      types: detail.types?.map((t: any) => t.type.name) || [],
      addedAt: Date.now()
    };
  });

  // Computed: Get primary type color
  primaryTypeColor = computed(() => {
    const detail = this.pokemonDetail();
    if (!detail || !detail.types || detail.types.length === 0) return 'from-slate-600 to-slate-800';

    const typeColors: { [key: string]: string } = {
      normal:   'from-slate-400 to-slate-600',
      fire:     'from-orange-500 to-red-600',
      water:    'from-blue-500 to-cyan-600',
      electric: 'from-yellow-400 to-yellow-600',
      grass:    'from-emerald-500 to-green-600',
      ice:      'from-cyan-300 to-blue-400',
      fighting: 'from-red-600 to-orange-700',
      poison:   'from-purple-500 to-purple-700',
      ground:   'from-amber-600 to-yellow-700',
      flying:   'from-indigo-400 to-blue-500',
      psychic:  'from-pink-500 to-purple-600',
      bug:      'from-lime-500 to-green-600',
      rock:     'from-stone-500 to-amber-700',
      ghost:    'from-violet-700 to-purple-900',
      dragon:   'from-indigo-600 to-purple-700',
      dark:     'from-slate-800 to-gray-900',
      steel:    'from-slate-500 to-gray-600',
      fairy:    'from-pink-400 to-pink-600'
    };

    const primaryType = detail.types[0].type.name;
    return typeColors[primaryType] || 'from-slate-600 to-slate-800';
  });

  ngOnInit(): void {
    const pokemonData = this.pokemon();
    const name = pokemonData.name;

    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (data) => {
        this.pokemonDetail.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading pokemon detail:', err);
        this.loading.set(false);
      }
    });
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal:   'bg-slate-400',
      fire:     'bg-orange-500',
      water:    'bg-blue-500',
      electric: 'bg-yellow-400',
      grass:    'bg-emerald-500',
      ice:      'bg-cyan-300',
      fighting: 'bg-red-600',
      poison:   'bg-purple-500',
      ground:   'bg-amber-600',
      flying:   'bg-indigo-400',
      psychic:  'bg-pink-500',
      bug:      'bg-lime-500',
      rock:     'bg-stone-500',
      ghost:    'bg-violet-700',
      dragon:   'bg-indigo-600',
      dark:     'bg-slate-800',
      steel:    'bg-slate-500',
      fairy:    'bg-pink-400'
    };
    return colors[type] || 'bg-slate-500';
  }

  get id(): string {
    const detail = this.pokemonDetail();
    return detail ? detail.id.toString().padStart(3, '0') : '000';
  }

  get imageUrl(): string {
    const detail = this.pokemonDetail();
    return detail?.sprites?.other?.['official-artwork']?.front_default || '';
  }

  get name(): string {
    const detail = this.pokemonDetail();
    return detail ? detail.name : '';
  }
}