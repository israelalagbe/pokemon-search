export class StorageError extends Error {
  constructor(operation: 'save' | 'load' | 'clear', originalError?: Error) {
    super(`Failed to ${operation} data from localStorage`);
    this.name = 'StorageError';
    this.originalError = originalError;
  }

  public readonly originalError?: Error;
}
