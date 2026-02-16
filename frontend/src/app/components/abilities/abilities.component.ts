import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

interface AbilityDetails {
  name: string;
  pokemon: any[];
}

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './abilities.component.html'
})
export class AbilitiesComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  abilities = signal<any[]>([]);
  loading = signal<boolean>(true);
  selectedAbility = signal<string | null>(null);
  showStrongestOnly = signal<boolean>(false);
  abilityDetails = signal<Map<string, AbilityDetails>>(new Map());
  loadingDetails = signal<boolean>(false);

  // Group Pokémon by ability
  groupedPokemon = computed(() => {
    const grouped: { [key: string]: any[] } = {};
    const detailsMap = this.abilityDetails();
    
    this.abilities().forEach(ability => {
      const details = detailsMap.get(ability.name);
      if (details) {
        grouped[ability.name] = details.pokemon;
      }
    });
    
    return grouped;
  });

  // Get strongest Pokémon per ability
  strongestPerAbility = computed(() => {
    const strongest: { [key: string]: any } = {};
    const grouped = this.groupedPokemon();
    
    Object.keys(grouped).forEach(ability => {
      const pokemon = grouped[ability];
      if (pokemon && pokemon.length > 0) {
        strongest[ability] = pokemon.reduce((prev, current) => {
          return (current.bst > prev.bst) ? current : prev;
        });
      }
    });
    
    return strongest;
  });

  ngOnInit(): void {
    this.loadAbilities();
  }

  async loadAbilities(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/ability?limit=100');
      const data = await response.json();
      this.abilities.set(data.results);
      this.loading.set(false);
    } catch (error) {
      console.error('Failed to load abilities', error);
      this.loading.set(false);
    }
  }

  async selectAbility(abilityName: string): Promise<void> {
    this.selectedAbility.set(abilityName);
    
    // Check if we already have the details
    if (!this.abilityDetails().has(abilityName)) {
      await this.loadAbilityDetails(abilityName);
    }
  }

  async loadAbilityDetails(abilityName: string): Promise<void> {
    this.loadingDetails.set(true);
    try {
      const ability = this.abilities().find(a => a.name === abilityName);
      if (!ability) return;

      const response = await fetch(ability.url);
      const abilityData = await response.json();
      
      // Get all Pokémon with this ability (limit to 30 for performance)
      const pokemonPromises = abilityData.pokemon.slice(0, 30).map((p: any) =>
        fetch(p.pokemon.url)
          .then(res => res.json())
          .then(pokemonData => ({
            ...pokemonData,
            bst: pokemonData.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
          }))
          .catch(() => null)
      );
      
      const pokemonList = await Promise.all(pokemonPromises);
      const validPokemon = pokemonList.filter(p => p !== null);
      
      const newMap = new Map(this.abilityDetails());
      newMap.set(abilityName, {
        name: abilityName,
        pokemon: validPokemon
      });
      this.abilityDetails.set(newMap);
      
      this.loadingDetails.set(false);
    } catch (error) {
      console.error(`Failed to load ${abilityName}`, error);
      this.loadingDetails.set(false);
    }
  }

  clearSelection(): void {
    this.selectedAbility.set(null);
  }

  toggleStrongestOnly(): void {
    this.showStrongestOnly.update(v => !v);
  }

  getAbilityColor(index: number): string {
    const colors = [
      'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'bg-violet-500/20 text-violet-400 border-violet-500/30'
    ];
    return colors[index % colors.length];
  }
}
