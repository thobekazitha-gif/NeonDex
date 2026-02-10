import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LoadingSpinnerComponent, 
    ErrorMessageComponent,
    FavoriteButtonComponent
  ],
  templateUrl: './pokemon-detail.component.html'
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  pokemon = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Convert Pokemon data to FavoritePokemon format
  favoritePokemon = computed(() => {
    const poke = this.pokemon();
    if (!poke) return null;
    
    return {
      id: poke.id,
      name: poke.name,
      imageUrl: poke.sprites?.other?.['official-artwork']?.front_default || 
                poke.sprites?.front_default ||
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
      types: poke.types?.map((t: any) => t.type.name) || [],
      addedAt: Date.now()
    };
  });

  // COMPUTED FEATURE 1: Strongest Stat
  strongestStat = computed(() => {
    const poke = this.pokemon();
    if (!poke || !poke.stats) return null;
    
    return poke.stats.reduce((max: any, stat: any) => 
      stat.base_stat > max.base_stat ? stat : max
    );
  });

  // COMPUTED FEATURE 2: Total Base Stats (BST)
  totalBaseStats = computed(() => {
    const poke = this.pokemon();
    if (!poke || !poke.stats) return 0;
    
    return poke.stats.reduce((sum: number, stat: any) => 
      sum + stat.base_stat, 0
    );
  });

  // COMPUTED FEATURE 3: Power Rating (categorize based on BST)
  powerRating = computed(() => {
    const total = this.totalBaseStats();
    if (total >= 600) return { label: 'Legendary', color: 'text-yellow-400' };
    if (total >= 500) return { label: 'Elite', color: 'text-purple-400' };
    if (total >= 400) return { label: 'Advanced', color: 'text-blue-400' };
    if (total >= 300) return { label: 'Standard', color: 'text-green-400' };
    return { label: 'Basic', color: 'text-slate-400' };
  });

  // Helper function for type colors
  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
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
    return colors[type] || 'bg-slate-500';
  }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemonDetails(name);
    }
  }

  loadPokemonDetails(name: string): void {
    this.loading.set(true);
    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (data: any) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('TARGET DATA UNREACHABLE. NEURAL LINK FAILED.');
        this.loading.set(false);
      }
    });
  }
}