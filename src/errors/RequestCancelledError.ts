/**
 * Base error class for request cancellation
 */
export class RequestCancelledError extends Error {
  constructor(message: string = 'Request was cancelled') {
    super(message);
    this.name = 'RequestCancelledError';
  }
}
