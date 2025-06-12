/**
 * Error class for when a Pokemon is not found
 */
export class PokemonNotFoundError extends Error {
  constructor(pokemonId: string | number) {
    super(`Pokemon with ID ${pokemonId} not found`);
    this.name = 'PokemonNotFoundError';
  }
}
