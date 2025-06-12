/**
 * Error class for search-related failures
 */
export class SearchError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'SearchError';
  }
}
