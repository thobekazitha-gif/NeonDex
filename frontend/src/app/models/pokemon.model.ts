// src/app/models/pokemon.model.ts
export interface Stat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface TypeSlot {
  slot: number;
  type: { name: string; url: string };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  sprites: {
    front_default?: string;
    other?: {
      'official-artwork'?: { front_default?: string };
    };
  };
  types: TypeSlot[];
  stats: Stat[];
  bst?: number;           // computed client-side
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}