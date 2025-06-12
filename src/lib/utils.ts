import type { Pokemon } from '@/types/pokemon';
import { RequestCancelledError } from '@/errors';

export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}

export function getStatColor(statName: string): string {
  const colorMap: Record<string, string> = {
    hp: 'text-red-600',
    attack: 'text-orange-600',
    defense: 'text-blue-600',
    'special-attack': 'text-purple-600',
    'special-defense': 'text-green-600',
    speed: 'text-yellow-600',
  };
  return colorMap[statName] || 'text-gray-600';
}

export function getTypeColor(typeName: string): string {
  const colorMap: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  return colorMap[typeName] || 'bg-gray-400';
}

export function isPokemonInTeam(pokemon: Pokemon, team: Pokemon[]): boolean {
  return team.some(teamMember => teamMember.id === pokemon.id);
}

export function getTeamScoreDescription(score: number): { description: string; color: string } {
  if (score >= 80) {
    return { description: 'Excellent Team!', color: 'text-green-600' };
  } else if (score >= 60) {
    return { description: 'Great Team!', color: 'text-blue-600' };
  } else if (score >= 40) {
    return { description: 'Good Team', color: 'text-yellow-600' };
  } else if (score >= 20) {
    return { description: 'Decent Team', color: 'text-orange-600' };
  } else {
    return { description: 'Room for Improvement', color: 'text-red-600' };
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function createDebouncedSearch() {
  let timeout: NodeJS.Timeout;
  let currentController: AbortController | null = null;

  return {
    search: (searchFn: (query: string, signal: AbortSignal) => Promise<void>, query: string, delay: number = 500) => {
      if (currentController) {
        currentController.abort();
      }
      
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        currentController = new AbortController();
        searchFn(query, currentController.signal).catch((error) => {
          if (!(error instanceof RequestCancelledError)) {
            console.error('Search error:', error);
          }
        });
      }, delay);
    },
    
    cancel: () => {
      clearTimeout(timeout);
      if (currentController) {
        currentController.abort();
        currentController = null;
      }
    }
  };
}
