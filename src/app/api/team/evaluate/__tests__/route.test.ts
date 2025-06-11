/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/team/evaluate/route';

const mockPokemon = {
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
    { base_stat: 50, stat: { name: 'defense' } },
    { base_stat: 50, stat: { name: 'special-attack' } },
    { base_stat: 40, stat: { name: 'special-defense' } },
    { base_stat: 90, stat: { name: 'speed' } },
  ],
  types: [{ type: { name: 'electric' } }],
  height: 4,
  weight: 60,
};

const mockStrongPokemon = {
  ...mockPokemon,
  id: 150,
  name: 'mewtwo',
  stats: [
    { base_stat: 106, stat: { name: 'hp' } },
    { base_stat: 110, stat: { name: 'attack' } },
    { base_stat: 90, stat: { name: 'defense' } },
    { base_stat: 154, stat: { name: 'special-attack' } },
    { base_stat: 90, stat: { name: 'special-defense' } },
    { base_stat: 130, stat: { name: 'speed' } },
  ],
  types: [{ type: { name: 'psychic' } }],
};

describe('/api/team/evaluate', () => {
  it('should return 400 if team is not an array', async () => {
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team: 'not an array' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Team must be an array of Pokemon');
  });

  it('should return 400 if team is empty', async () => {
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team: [] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Team cannot be empty');
  });

  it('should return 400 if team has more than 6 pokemon', async () => {
    const team = Array(7).fill(mockPokemon);
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Team cannot have more than 6 Pokemon');
  });

  it('should calculate team stats correctly for a single pokemon', async () => {
    const team = [mockPokemon];
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      averageHp: 35,
      averageAttack: 55,
      averageDefense: 50,
      averageSpAttack: 50,
      averageSpDefense: 40,
      averageSpeed: 90,
      uniqueTypes: ['electric'],
      teamScore: 15, // 10 points for 1 unique type + 5 for no duplicates
    });
  });

  it('should calculate team stats correctly for multiple pokemon', async () => {
    const team = [mockPokemon, mockStrongPokemon];
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.averageHp).toBe(Math.round((35 + 106) / 2)); // 71
    expect(data.averageAttack).toBe(Math.round((55 + 110) / 2)); // 83
    expect(data.averageSpeed).toBe(Math.round((90 + 130) / 2)); // 110
    expect(data.uniqueTypes).toEqual(['electric', 'psychic']);
    expect(data.teamScore).toBe(25); // 20 points for 2 unique types + 5 for no duplicate types
  });

  it('should apply scoring rules correctly', async () => {
    // Create a team with high HP average (>80) and good speed (>50)
    const team = [mockStrongPokemon]; // HP: 106, Speed: 130
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should get: 10 (unique type) + 5 (HP > 80) + 5 (no duplicates) = 20
    expect(data.teamScore).toBe(20);
  });

  it('should penalize low speed teams', async () => {
    const slowPokemon = {
      ...mockPokemon,
      stats: [
        { base_stat: 50, stat: { name: 'hp' } },
        { base_stat: 50, stat: { name: 'attack' } },
        { base_stat: 50, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 30, stat: { name: 'speed' } }, // Low speed
      ],
    };

    const team = [slowPokemon];
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: JSON.stringify({ team }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should get: 10 (unique type) + 5 (no duplicates) - 5 (speed < 50) = 10
    expect(data.teamScore).toBe(10);
  });

  it('should handle malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/team/evaluate', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('Internal server error');
  });
});
