/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/pokemon/search/route';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(require('axios'));

const mockPokemonResponse = {
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

const mockSearchResponse = {
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon/172/' },
  ],
};

describe('/api/pokemon/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no query provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/pokemon/search');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Search query is required');
  });

  it('should search by ID and return pokemon data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPokemonResponse });

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=25');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([mockPokemonResponse]);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
  });

  it('should search by exact name and return pokemon data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPokemonResponse });

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=pikachu');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([mockPokemonResponse]);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
  });

  it('should return 404 for non-existent pokemon ID', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    });

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=99999');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('Pokemon not found');
  });

  it('should search by partial name when exact match fails', async () => {
    // First call (exact match) fails
    mockedAxios.get
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404 },
      })
      // Second call (get all pokemon) succeeds
      .mockResolvedValueOnce({ data: mockSearchResponse })
      // Third call (get pokemon details) succeeds
      .mockResolvedValueOnce({ data: mockPokemonResponse });

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=pika');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([mockPokemonResponse]);
  });

  it('should return 404 when no partial matches found', async () => {
    mockedAxios.get
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404 },
      })
      .mockResolvedValueOnce({
        data: { results: [{ name: 'charizard', url: 'test' }] },
      });

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=nonexistent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('No Pokemon found matching your search');
  });

  it('should return 500 for unexpected errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/pokemon/search?q=pikachu');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('Internal server error');
  });
});
