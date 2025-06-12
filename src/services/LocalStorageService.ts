import type { Pokemon } from '@/types/pokemon';
import { StorageError } from '@/errors';

/**
 * Service for localStorage operations
 */
export class LocalStorageService {
  private static TEAM_KEY = 'pokemon-team';

  /**
   * Save a Pokemon team to localStorage
   */
  static saveTeam(team: Pokemon[]): void {
    try {
      localStorage.setItem(this.TEAM_KEY, JSON.stringify(team));
    } catch (error) {
      const storageError = new StorageError('save', error as Error);
      console.error('Failed to save team to localStorage:', storageError);
      // Don't throw for saveTeam to maintain backward compatibility
    }
  }

  /**
   * Load a Pokemon team from localStorage
   */
  static loadTeam(): Pokemon[] {
    try {
      const savedTeam = localStorage.getItem(this.TEAM_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      const storageError = new StorageError('load', error as Error);
      console.error('Failed to load team from localStorage:', storageError);
      return [];
    }
  }

  /**
   * Clear the saved Pokemon team from localStorage
   */
  static clearTeam(): void {
    try {
      localStorage.removeItem(this.TEAM_KEY);
    } catch (error) {
      const storageError = new StorageError('clear', error as Error);
      console.error('Failed to clear team from localStorage:', storageError);
      // Don't throw for clearTeam to maintain backward compatibility
    }
  }

  /**
   * Save user preferences to localStorage
   */
  static savePreferences(preferences: Record<string, any>): void {
    try {
      localStorage.setItem('pokemon-preferences', JSON.stringify(preferences));
    } catch (error) {
      const storageError = new StorageError('save', error as Error);
      console.error('Failed to save preferences to localStorage:', storageError);
      // Don't throw to maintain consistency
    }
  }

  /**
   * Load user preferences from localStorage
   */
  static loadPreferences(): Record<string, any> {
    try {
      const savedPreferences = localStorage.getItem('pokemon-preferences');
      return savedPreferences ? JSON.parse(savedPreferences) : {};
    } catch (error) {
      const storageError = new StorageError('load', error as Error);
      console.error('Failed to load preferences from localStorage:', storageError);
      return {};
    }
  }
}
