import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './types.component.html',
  styles: []
})
export class TypesComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  loading = signal(false);
  error = signal<string | null>(null);
  selectedType = signal<string | null>(null);
  showStrongestOnly = signal(false);

  // All 18 Pokemon types
  private allTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  // Only show types that have at least 1 Pokemon in the loaded dataset
  types = computed(() => {
    const grouped = this.groupedPokemon();
    return this.allTypes.filter(type => {
      const pokemonOfType = grouped[type];
      return pokemonOfType && pokemonOfType.length > 0;
    });
  });

  groupedPokemon = computed(() => {
    const all = this.pokemonService.pokemonList();
    const grouped: { [key: string]: any[] } = {};

    this.allTypes.forEach(type => {
      grouped[type] = all.filter(p =>
        p.types?.some((t: any) => t.type.name === type)
      );
    });

    return grouped;
  });

  strongestPerType = computed(() => {
    const grouped = this.groupedPokemon();
    const strongest: { [key: string]: any } = {};

    Object.keys(grouped).forEach(type => {
      const pokemons = grouped[type];
      if (pokemons && pokemons.length > 0) {
        strongest[type] = pokemons.reduce((max, p) =>
          (p.bst || 0) > (max.bst || 0) ? p : max
        );
      }
    });

    return strongest;
  });

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Load 300 Pokemon to cover all 18 types
      // Dark-type Pokemon start at #197 (Umbreon)
      await this.pokemonService.loadAllPokemon(300);
    } catch (err) {
      this.error.set('Failed to load Pokémon data');
      console.error('Error loading Pokemon:', err);
    } finally {
      this.loading.set(false);
    }
  }

  filterByType(type: string) {
    this.selectedType.set(type);
  }

  clearFilter() {
    this.selectedType.set(null);
  }

  toggleStrongestOnly() {
    this.showStrongestOnly.update(v => !v);
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal:   'bg-gray-400',
      fire:     'bg-orange-500',
      water:    'bg-blue-500',
      grass:    'bg-green-500',
      electric: 'bg-yellow-400',
      ice:      'bg-cyan-400',
      fighting: 'bg-red-600',
      poison:   'bg-purple-500',
      ground:   'bg-yellow-600',
      flying:   'bg-indigo-400',
      psychic:  'bg-pink-500',
      bug:      'bg-lime-500',
      rock:     'bg-yellow-700',
      ghost:    'bg-purple-700',
      dragon:   'bg-indigo-600',
      dark:     'bg-gray-700',
      steel:    'bg-gray-500',
      fairy:    'bg-pink-400'
    };
    return colors[type] || 'bg-gray-400';
  }
}
