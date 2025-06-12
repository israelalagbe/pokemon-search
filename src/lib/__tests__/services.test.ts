import { PokemonService, TeamService, LocalStorageService, TeamStorageService } from '@/services';
import { RequestCancelledError, SearchError, TeamEvaluationError } from '@/errors';
import axios from 'axios';
import type { Pokemon } from '@/types/pokemon';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

describe('PokemonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchPokemon', () => {
    it('should search pokemon successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: [mockPokemon] });

      const result = await PokemonService.searchPokemon('pikachu');

      expect(result).toEqual([mockPokemon]);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/pokemon/search?q=pikachu', {
        signal: undefined,
      });
    });

    it('should search pokemon with abort signal', async () => {
      const controller = new AbortController();
      mockedAxios.get.mockResolvedValue({ data: [mockPokemon] });

      const result = await PokemonService.searchPokemon('pikachu', controller.signal);

      expect(result).toEqual([mockPokemon]);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/pokemon/search?q=pikachu', {
        signal: controller.signal,
      });
    });

    it('should handle cancellation errors', async () => {
      const controller = new AbortController();
      const cancelError = new Error('Request cancelled');
      (cancelError as any).code = 'ERR_CANCELED';
      mockedAxios.get.mockRejectedValue(cancelError);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(PokemonService.searchPokemon('pikachu', controller.signal)).rejects.toThrow(RequestCancelledError);
    });

    it('should handle API errors', async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 404, data: { message: 'Pokemon not found' } },
      };
      mockedAxios.get.mockRejectedValue(mockError);
      // Mock axios.isAxiosError to return true for our mock error
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(PokemonService.searchPokemon('invalid')).rejects.toThrow(SearchError);
      
      try {
        await PokemonService.searchPokemon('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(SearchError);
        expect((error as SearchError).message).toBe('Pokemon not found');
      }
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValue(networkError);
      // Mock axios.isAxiosError to return false for regular errors
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      await expect(PokemonService.searchPokemon('pikachu')).rejects.toThrow(SearchError);
    });
  });
});

describe('TeamService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('evaluateTeam', () => {
    it('should evaluate team successfully', async () => {
      const mockStats = {
        averageHp: 35,
        averageAttack: 55,
        averageDefense: 50,
        averageSpAttack: 50,
        averageSpDefense: 40,
        averageSpeed: 90,
        uniqueTypes: ['electric'],
        teamScore: 15,
      };

      mockedAxios.post.mockResolvedValue({ data: mockStats });

      const result = await TeamService.evaluateTeam([mockPokemon]);

      expect(result).toEqual(mockStats);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/team/evaluate', { team: [mockPokemon] });
    });

    it('should handle evaluation errors', async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 400, data: { message: 'Team cannot be empty' } },
      };
      mockedAxios.post.mockRejectedValue(mockError);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(TeamService.evaluateTeam([])).rejects.toThrow(TeamEvaluationError);
      
      try {
        await TeamService.evaluateTeam([]);
      } catch (error) {
        expect(error).toBeInstanceOf(TeamEvaluationError);
        expect((error as TeamEvaluationError).message).toBe('Team cannot be empty');
      }
    });
  });
});

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save data to localStorage', () => {
      const testData = { test: 'data' };

      LocalStorageService.save('test-key', testData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('should handle save errors gracefully', () => {
      const testData = { test: 'data' };
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      expect(() => LocalStorageService.save('test-key', testData)).not.toThrow();
    });
  });

  describe('load', () => {
    it('should load data from localStorage', () => {
      const testData = { test: 'data' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      const result = LocalStorageService.load('test-key', {});

      expect(result).toEqual(testData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return default value when no data saved', () => {
      const defaultValue = { default: 'value' };
      localStorageMock.getItem.mockReturnValue(null);

      const result = LocalStorageService.load('test-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should handle load errors gracefully', () => {
      const defaultValue = { default: 'value' };
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = LocalStorageService.load('test-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should handle invalid JSON gracefully', () => {
      const defaultValue = { default: 'value' };
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = LocalStorageService.load('test-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });
  });

  describe('remove', () => {
    it('should remove data from localStorage', () => {
      LocalStorageService.remove('test-key');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle remove errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      expect(() => LocalStorageService.remove('test-key')).not.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true if key exists', () => {
      localStorageMock.getItem.mockReturnValue('some data');

      const result = LocalStorageService.exists('test-key');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = LocalStorageService.exists('test-key');

      expect(result).toBe(false);
    });
  });
});

describe('TeamStorageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('saveTeam', () => {
    it('should save team to localStorage', () => {
      const team = [mockPokemon];

      TeamStorageService.saveTeam(team);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-team',
        JSON.stringify(team)
      );
    });
  });

  describe('loadTeam', () => {
    it('should load team from localStorage', () => {
      const team = [mockPokemon];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(team));

      const result = TeamStorageService.loadTeam();

      expect(result).toEqual(team);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pokemon-team');
    });

    it('should return empty array when no team saved', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = TeamStorageService.loadTeam();

      expect(result).toEqual([]);
    });
  });

  describe('clearTeam', () => {
    it('should clear team from localStorage', () => {
      TeamStorageService.clearTeam();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pokemon-team');
    });
  });

  describe('hasTeam', () => {
    it('should return true if team exists', () => {
      localStorageMock.getItem.mockReturnValue('[{"id": 1}]');

      const result = TeamStorageService.hasTeam();

      expect(result).toBe(true);
    });

    it('should return false if no team exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = TeamStorageService.hasTeam();

      expect(result).toBe(false);
    });
  });
});
