export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: PokemonStat[];
  types: PokemonType[];
  height: number;
  weight: number;
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonSearchResult {
  name: string;
  url: string;
}

export interface PokemonSearchResponse {
  results: PokemonSearchResult[];
}

export interface TeamStats {
  averageHp: number;
  averageAttack: number;
  averageDefense: number;
  averageSpAttack: number;
  averageSpDefense: number;
  averageSpeed: number;
  uniqueTypes: string[];
  teamScore: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
