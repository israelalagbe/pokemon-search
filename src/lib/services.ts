import axios from 'axios';
import type { Pokemon, TeamStats, ApiError } from '@/types/pokemon';

const API_BASE_URL = '/api';

export class PokemonService {
  static async searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon/search?q=${encodeURIComponent(query)}`, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled');
        }
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Failed to search Pokemon',
          status: error.response?.status,
        };
        throw apiError;
      }
      throw new Error('Network error occurred');
    }
  }

  static async evaluateTeam(team: Pokemon[]): Promise<TeamStats> {
    try {
      const response = await axios.post(`${API_BASE_URL}/team/evaluate`, { team });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Failed to evaluate team',
          status: error.response?.status,
        };
        throw apiError;
      }
      throw new Error('Network error occurred');
    }
  }
}

export class LocalStorageService {
  private static TEAM_KEY = 'pokemon-team';

  static saveTeam(team: Pokemon[]): void {
    try {
      localStorage.setItem(this.TEAM_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Failed to save team to localStorage:', error);
    }
  }

  static loadTeam(): Pokemon[] {
    try {
      const savedTeam = localStorage.getItem(this.TEAM_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      console.error('Failed to load team from localStorage:', error);
      return [];
    }
  }

  static clearTeam(): void {
    try {
      localStorage.removeItem(this.TEAM_KEY);
    } catch (error) {
      console.error('Failed to clear team from localStorage:', error);
    }
  }
}
