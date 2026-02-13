import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Pokemon {
  name: string;
  url: string;
  id?: number;
  sprites?: any;
  types?: any[];
  abilities?: any[];
  stats?: any[];
  height?: number;
  weight?: number;
  species?: any;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

interface TypeEffectiveness {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  
  pokemonList = signal<Pokemon[]>([]);
  allPokemonLoaded = signal<boolean>(false);

  // Type effectiveness chart (simplified)
  private typeChart: { [key: string]: TypeEffectiveness } = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
  };

  constructor(private http: HttpClient) {}

  // Method to get paginated list of Pokemon
  getPokemonList(offset: number = 0, limit: number = 15): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`
    );
  }

  // Method to get detailed Pokemon data by ID or name
  getPokemonDetail(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${idOrName}`);
  }

  // Method to get Pokemon species data
  getPokemonSpecies(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon-species/${idOrName}`);
  }

  // Method to get evolution chain
  getEvolutionChain(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evolution-chain/${id}`);
  }

  // Load all Pokemon (for types page and filtering)
  async loadAllPokemon(): Promise<void> {
    if (this.allPokemonLoaded()) {
      return;
    }

    try {
      // Load first 151 Pokemon (Generation 1)
      const requests = Array.from({ length: 151 }, (_, i) => i + 1).map(id =>
        this.getPokemonDetail(id.toString()).pipe(
          catchError(() => of(null))
        )
      );

      const results = await forkJoin(requests).toPromise();
      const validPokemon = (results || []).filter(p => p !== null) as Pokemon[];
      this.pokemonList.set(validPokemon);
      this.allPokemonLoaded.set(true);
    } catch (error) {
      console.error('Failed to load all Pokemon:', error);
      throw error;
    }
  }

  // Simulate a battle between two Pokemon
  simulateBattle(pokemon1: any, pokemon2: any): { winner: any; loser: any; score: number } {
    if (!pokemon1 || !pokemon2) {
      return { winner: pokemon1 || pokemon2, loser: null, score: 100 };
    }

    let score1 = 0;
    let score2 = 0;

    // Calculate base stats total
    const stats1 = this.getTotalStats(pokemon1);
    const stats2 = this.getTotalStats(pokemon2);
    
    score1 += stats1;
    score2 += stats2;

    // Calculate type advantages
    const typeAdv1 = this.getTypeAdvantage(pokemon1, pokemon2);
    const typeAdv2 = this.getTypeAdvantage(pokemon2, pokemon1);

    score1 += typeAdv1 * 50;
    score2 += typeAdv2 * 50;

    // Determine winner
    if (score1 > score2) {
      const winPercentage = Math.round((score1 / (score1 + score2)) * 100);
      return { winner: pokemon1, loser: pokemon2, score: winPercentage };
    } else if (score2 > score1) {
      const winPercentage = Math.round((score2 / (score1 + score2)) * 100);
      return { winner: pokemon2, loser: pokemon1, score: winPercentage };
    } else {
      return { winner: pokemon1, loser: pokemon2, score: 50 };
    }
  }

  // Get total stats of a Pokemon
  private getTotalStats(pokemon: any): number {
    if (!pokemon?.stats) return 0;
    return pokemon.stats.reduce((sum: number, stat: any) => sum + (stat.base_stat || 0), 0);
  }

  // Calculate type advantage
  private getTypeAdvantage(attacker: any, defender: any): number {
    if (!attacker?.types || !defender?.types) return 1;

    let maxMultiplier = 1;

    attacker.types.forEach((attackerType: any) => {
      const attackType = attackerType.type.name;
      
      defender.types.forEach((defenderType: any) => {
        const defenseType = defenderType.type.name;
        
        if (this.typeChart[attackType] && this.typeChart[attackType][defenseType] !== undefined) {
          const multiplier = this.typeChart[attackType][defenseType];
          if (multiplier > maxMultiplier) {
            maxMultiplier = multiplier;
          }
        }
      });
    });

    return maxMultiplier;
  }

  // Get defensive score based on types
  getTypeDefensiveScore(types: string[]): number {
    if (!types || types.length === 0) return 50;

    let resistances = 0;
    let weaknesses = 0;
    let immunities = 0;

    // Check each attacking type against this Pokemon's types
    Object.keys(this.typeChart).forEach(attackingType => {
      let effectiveness = 1;

      types.forEach(defendingType => {
        const typeEffectiveness = this.typeChart[attackingType];
        if (typeEffectiveness && typeEffectiveness[defendingType] !== undefined) {
          effectiveness *= typeEffectiveness[defendingType];
        }
      });

      if (effectiveness === 0) immunities++;
      else if (effectiveness < 1) resistances++;
      else if (effectiveness > 1) weaknesses++;
    });

    // Calculate defensive score (0-100)
    // More resistances/immunities = higher score
    // More weaknesses = lower score
    const baseScore = 50;
    const resistanceBonus = (resistances * 3) + (immunities * 5);
    const weaknessPenalty = weaknesses * 3;

    return Math.max(0, Math.min(100, baseScore + resistanceBonus - weaknessPenalty));
  }

  // Get type color for UI
  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#777';
  }
}