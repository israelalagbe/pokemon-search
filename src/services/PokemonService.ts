import axios from 'axios';
import type { Pokemon, ApiError } from '@/types/pokemon';
import { RequestCancelledError, SearchError } from '@/errors';

const API_BASE_URL = '/api';

/**
 * Service for Pokemon-related API operations
 */
export class PokemonService {
  /**
   * Search for Pokemon by query string
   */
  static async searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon/search?q=${encodeURIComponent(query)}`, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new RequestCancelledError();
        }
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Failed to search Pokemon',
          status: error.response?.status,
        };
        throw new SearchError(apiError.message, error);
      }
      throw new SearchError('Network error occurred', error as Error);
    }
  }

  /**
   * Get Pokemon by ID
   */
  static async getPokemonById(id: number, signal?: AbortSignal): Promise<Pokemon> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new RequestCancelledError();
        }
        if (error.response?.status === 404) {
          throw new SearchError(`Pokemon with ID ${id} not found`, error);
        }
        const apiError: ApiError = {
          message: error.response?.data?.message || `Failed to fetch Pokemon with ID ${id}`,
          status: error.response?.status,
        };
        throw new SearchError(apiError.message, error);
      }
      throw new SearchError('Network error occurred', error as Error);
    }
  }
}
