import {
  formatPokemonName,
  formatPokemonId,
  getStatColor,
  getTypeColor,
  isPokemonInTeam,
  getTeamScoreDescription,
  debounce,
} from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';

// Mock Pokemon data for testing
const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu-artwork.png',
      },
    },
  },
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
  ],
  types: [{ type: { name: 'electric' } }],
  height: 4,
  weight: 60,
};

describe('formatPokemonName', () => {
  it('should capitalize the first letter', () => {
    expect(formatPokemonName('pikachu')).toBe('Pikachu');
    expect(formatPokemonName('CHARIZARD')).toBe('CHARIZARD');
    expect(formatPokemonName('mEwTwO')).toBe('MEwTwO');
  });

  it('should handle empty strings', () => {
    expect(formatPokemonName('')).toBe('');
  });
});

describe('formatPokemonId', () => {
  it('should format IDs with leading zeros', () => {
    expect(formatPokemonId(1)).toBe('#001');
    expect(formatPokemonId(25)).toBe('#025');
    expect(formatPokemonId(150)).toBe('#150');
    expect(formatPokemonId(1000)).toBe('#1000');
  });
});

describe('getStatColor', () => {
  it('should return correct colors for stats', () => {
    expect(getStatColor('hp')).toBe('text-red-600');
    expect(getStatColor('attack')).toBe('text-orange-600');
    expect(getStatColor('defense')).toBe('text-blue-600');
    expect(getStatColor('special-attack')).toBe('text-purple-600');
    expect(getStatColor('special-defense')).toBe('text-green-600');
    expect(getStatColor('speed')).toBe('text-yellow-600');
  });

  it('should return default color for unknown stats', () => {
    expect(getStatColor('unknown-stat')).toBe('text-gray-600');
  });
});

describe('getTypeColor', () => {
  it('should return correct colors for types', () => {
    expect(getTypeColor('fire')).toBe('bg-red-500');
    expect(getTypeColor('water')).toBe('bg-blue-500');
    expect(getTypeColor('electric')).toBe('bg-yellow-400');
    expect(getTypeColor('grass')).toBe('bg-green-500');
  });

  it('should return default color for unknown types', () => {
    expect(getTypeColor('unknown-type')).toBe('bg-gray-400');
  });
});

describe('isPokemonInTeam', () => {
  const team = [mockPokemon];

  it('should return true if pokemon is in team', () => {
    expect(isPokemonInTeam(mockPokemon, team)).toBe(true);
  });

  it('should return false if pokemon is not in team', () => {
    const differentPokemon = { ...mockPokemon, id: 26 };
    expect(isPokemonInTeam(differentPokemon, team)).toBe(false);
  });

  it('should return false for empty team', () => {
    expect(isPokemonInTeam(mockPokemon, [])).toBe(false);
  });
});

describe('getTeamScoreDescription', () => {
  it('should return correct descriptions for different scores', () => {
    expect(getTeamScoreDescription(85)).toEqual({
      description: 'Excellent Team!',
      color: 'text-green-600',
    });

    expect(getTeamScoreDescription(65)).toEqual({
      description: 'Great Team!',
      color: 'text-blue-600',
    });

    expect(getTeamScoreDescription(45)).toEqual({
      description: 'Good Team',
      color: 'text-yellow-600',
    });

    expect(getTeamScoreDescription(25)).toEqual({
      description: 'Decent Team',
      color: 'text-orange-600',
    });

    expect(getTeamScoreDescription(10)).toEqual({
      description: 'Room for Improvement',
      color: 'text-red-600',
    });
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should cancel previous calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });
});
