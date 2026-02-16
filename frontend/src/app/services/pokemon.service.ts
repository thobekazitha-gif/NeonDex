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

  // Type effectiveness chart (offensive multipliers)
  // attacker type → defender type → multiplier
  private typeChart: { [key: string]: TypeEffectiveness } = {
    normal:   { rock: 0.5, ghost: 0,   steel: 0.5 },
    fire:     { fire: 0.5, water: 0.5, grass: 2,   ice: 2,   bug: 2,   rock: 0.5, dragon: 0.5, steel: 2   },
    water:    { fire: 2,   water: 0.5, grass: 0.5, ground: 2, rock: 2,   dragon: 0.5 },
    electric: { water: 2,  electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2,   grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2,   ice: 0.5,  ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison:   { grass: 2,  poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground:   { fire: 2,   electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock:     { fire: 2,   ice: 2,     fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
    dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
  };

  constructor(private http: HttpClient) {}

  // ──────────────────────────────────────────────
  //  Get paginated list of Pokemon
  // ──────────────────────────────────────────────
  getPokemonList(offset: number = 0, limit: number = 15): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`
    );
  }

  // ──────────────────────────────────────────────
  //  Get detailed Pokemon data by name or id
  // ──────────────────────────────────────────────
  getPokemonDetail(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${idOrName.toLowerCase()}`);
  }

  // ──────────────────────────────────────────────
  //  Get Pokemon species data
  // ──────────────────────────────────────────────
  getPokemonSpecies(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon-species/${idOrName.toLowerCase()}`);
  }

  // ──────────────────────────────────────────────
  //  Get evolution chain
  // ──────────────────────────────────────────────
  getEvolutionChain(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evolution-chain/${id}`);
  }

  // ──────────────────────────────────────────────
  //  Load first 151 Pokemon (Gen 1) – used for types/filtering
  // ──────────────────────────────────────────────
  async loadAllPokemon(): Promise<void> {
    if (this.allPokemonLoaded()) return;

    try {
      const requests = Array.from({ length: 151 }, (_, i) => i + 1).map(id =>
        this.getPokemonDetail(id.toString()).pipe(catchError(() => of(null)))
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

  // ──────────────────────────────────────────────
  //  Simulate battle – returns shape expected by comparison template
  // ──────────────────────────────────────────────
  simulateBattle(pokeA: any, pokeB: any): {
    winner: any;
    loser: any | null;
    score: number;
    winProbabilityA: number;
    explanation: string;
    details: {
      aTypeScore: number;
      bTypeScore: number;
      aSpeedAdv: number;
      bSpeedAdv: number;
      aOffense: number;
      bOffense: number;
      aTotal: number;
      bTotal: number;
    };
  } {
    if (!pokeA || !pokeB) {
      return {
        winner: pokeA || pokeB,
        loser: null,
        score: 50,
        winProbabilityA: 50,
        explanation: 'Invalid Pokémon data – cannot simulate battle.',
        details: { aTypeScore: 0, bTypeScore: 0, aSpeedAdv: 0, bSpeedAdv: 0, aOffense: 0, bOffense: 0, aTotal: 0, bTotal: 0 }
      };
    }

    // ── Base stats totals ────────────────────────────────────────
    const totalA = this.getTotalStats(pokeA);
    const totalB = this.getTotalStats(pokeB);

    // ── Speed values ─────────────────────────────────────────────
    const speedA = pokeA.stats?.find((s: any) => s.stat.name === 'speed')?.base_stat ?? 50;
    const speedB = pokeB.stats?.find((s: any) => s.stat.name === 'speed')?.base_stat ?? 50;

    // ── Type advantage scores (offensive) ────────────────────────
    const typeAdvA = this.getTypeAdvantageScore(pokeA, pokeB);
    const typeAdvB = this.getTypeAdvantageScore(pokeB, pokeA);

    // ── Rough defensive / survivability score ────────────────────
    const defScoreA = this.getTypeDefensiveScore(pokeA.types?.map((t: any) => t.type.name) || []);
    const defScoreB = this.getTypeDefensiveScore(pokeB.types?.map((t: any) => t.type.name) || []);

    // ── Calculate weighted final scores ──────────────────────────
    const finalScoreA =
      totalA * 0.50 +
      speedA * 0.20 +
      typeAdvA * 30 +
      defScoreA * 0.8;

    const finalScoreB =
      totalB * 0.50 +
      speedB * 0.20 +
      typeAdvB * 30 +
      defScoreB * 0.8;

    // ── Determine winner & probability ───────────────────────────
    let winner = pokeA;
    let loser = pokeB;
    let probA = 50;

    if (finalScoreA > finalScoreB) {
      probA = 50 + (finalScoreA - finalScoreB) * 0.35;
    } else if (finalScoreB > finalScoreA) {
      winner = pokeB;
      loser = pokeA;
      probA = 50 - (finalScoreB - finalScoreA) * 0.35;
    }

    probA = Math.max(5, Math.min(95, Math.round(probA)));

    const margin = Math.abs(finalScoreA - finalScoreB);
    const score = Math.round(margin / 5); // rough scale

    // ── Build explanation ────────────────────────────────────────
    const explanationLines = [
      `Total base stats: ${totalA} vs ${totalB}`,
      `Speed: ${speedA} vs ${speedB}`,
      `Offensive type advantage: ${typeAdvA.toFixed(1)}× vs ${typeAdvB.toFixed(1)}×`,
      `Defensive resilience: ${defScoreA} vs ${defScoreB}`
    ];

    const winnerName = winner === pokeA ? 'A' : 'B';

    const explanation = [
      `Winner prediction: Pokémon ${winnerName} (${winner.name})`,
      ...explanationLines,
      '',
      `Win chance estimate: ~${probA}% for Pokémon A (${pokeA.name})`,
      'This is a simplified model — real battles depend heavily on moves, abilities, items, status conditions, etc.'
    ].join('\n');

    // ── Return full object expected by template ──────────────────
    return {
      winner,
      loser,
      score,
      winProbabilityA: probA,
      explanation,
      details: {
        aTypeScore:   Math.round(typeAdvA * 100),
        bTypeScore:   Math.round(typeAdvB * 100),
        aSpeedAdv:    speedA - speedB,
        bSpeedAdv:    speedB - speedA,
        aOffense:     Math.round(finalScoreA * 0.6),
        bOffense:     Math.round(finalScoreB * 0.6),
        aTotal:       totalA,
        bTotal:       totalB
      }
    };
  }

  // ──────────────────────────────────────────────
  //  Helpers used by simulateBattle
  // ──────────────────────────────────────────────
  private getTotalStats(pokemon: any): number {
    if (!pokemon?.stats) return 0;
    return pokemon.stats.reduce((sum: number, stat: any) => sum + (stat.base_stat || 0), 0);
  }

  private getTypeAdvantageScore(attacker: any, defender: any): number {
    if (!attacker?.types || !defender?.types) return 1;

    let totalMultiplier = 0;
    let count = 0;

    attacker.types.forEach((t: any) => {
      const atkType = t.type.name;
      defender.types.forEach((d: any) => {
        const defType = d.type.name;
        const mult = this.typeChart[atkType]?.[defType] ?? 1;
        totalMultiplier += mult;
        count++;
      });
    });

    return count > 0 ? totalMultiplier / count : 1;
  }

  getTypeDefensiveScore(types: string[]): number {
    if (!types || types.length === 0) return 50;

    let resistances = 0;
    let weaknesses = 0;
    let immunities = 0;

    Object.keys(this.typeChart).forEach(attackingType => {
      let effectiveness = 1;

      types.forEach(defendingType => {
        const mult = this.typeChart[attackingType]?.[defendingType];
        if (mult !== undefined) {
          effectiveness *= mult;
        }
      });

      if (effectiveness === 0) immunities++;
      else if (effectiveness < 1) resistances++;
      else if (effectiveness > 1) weaknesses++;
    });

    const base = 50;
    const bonus = resistances * 3 + immunities * 6;
    const penalty = weaknesses * 4;

    return Math.max(10, Math.min(120, base + bonus - penalty));
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal:   '#A8A878', fire:     '#F08030', water:    '#6890F0',
      electric: '#F8D030', grass:    '#78C850', ice:      '#98D8D8',
      fighting: '#C03028', poison:   '#A040A0', ground:   '#E0C068',
      flying:   '#A890F0', psychic:  '#F85888', bug:      '#A8B820',
      rock:     '#B8A038', ghost:    '#705898', dragon:   '#7038F8',
      dark:     '#705848', steel:    '#B8B8D0', fairy:    '#EE99AC'
    };
    return colors[type] || '#777777';
  }
}