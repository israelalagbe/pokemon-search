import { StorageError } from '@/errors';

export class LocalStorageService {
  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      const storageError = new StorageError('save', error as Error);
      console.error(`Failed to save data to localStorage (key: ${key}):`, storageError);
    }
  }

  static load<T>(key: string, defaultValue: T): T {
    try {
      const savedData = localStorage.getItem(key);
      return savedData ? JSON.parse(savedData) : defaultValue;
    } catch (error) {
      const storageError = new StorageError('load', error as Error);
      console.error(`Failed to load data from localStorage (key: ${key}):`, storageError);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      const storageError = new StorageError('clear', error as Error);
      console.error(`Failed to remove data from localStorage (key: ${key}):`, storageError);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      const storageError = new StorageError('clear', error as Error);
      console.error('Failed to clear localStorage:', storageError);
    }
  }

  static exists(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Failed to check if key exists in localStorage (key: ${key}):`, error);
      return false;
    }
  }

  static getKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Failed to get localStorage keys:', error);
      return [];
    }
  }
}
