<<<<<<< HEAD
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
=======
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05

@Component({
  selector: 'app-types',
  standalone: true,
<<<<<<< HEAD
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

  types = computed(() => {
    return [
      'normal', 'fire', 'water', 'grass', 'electric', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
  });

  groupedPokemon = computed(() => {
    const all = this.pokemonService.pokemonList();
    const grouped: { [key: string]: any[] } = {};

    this.types().forEach(type => {
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
      await this.pokemonService.loadAllPokemon();
    } catch (err) {
      this.error.set('Failed to load Pokémon data');
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
      normal: 'bg-gray-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-400',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-400'
    };
    return colors[type] || 'bg-gray-400';
  }
}
=======
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './types.component.html'
})
export class TypesComponent implements OnInit {
  types = signal<any[]>([]);
  loading = signal<boolean>(true);

  typeColors: { [key: string]: string } = {
    normal: 'bg-slate-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-emerald-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-slate-800',
    steel: 'bg-slate-500',
    fairy: 'bg-pink-400'
  };

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    this.loading.set(true);
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => {
        // Filter out unknown and shadow types
        const filteredTypes = data.results.filter((type: any) => 
          type.name !== 'unknown' && type.name !== 'shadow'
        );
        this.types.set(filteredTypes);
        this.loading.set(false);
      })
      .catch(error => {
        console.error('Failed to load types', error);
        this.loading.set(false);
      });
  }

  getTypeColor(typeName: string): string {
    return this.typeColors[typeName] || 'bg-slate-500';
  }

  getRandomFrequency(): number {
    return Math.floor(Math.random() * 999);
  }
}
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
