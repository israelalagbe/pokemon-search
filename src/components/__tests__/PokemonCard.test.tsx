import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from '@/components/PokemonCard';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
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
  ],
  types: [
    { type: { name: 'electric' } },
  ],
  height: 4,
  weight: 60,
};

describe('PokemonCard', () => {
  const mockOnAddToTeam = jest.fn();
  const mockOnRemoveFromTeam = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pokemon information correctly', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={false}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument(); // HP stat
    expect(screen.getByText('55')).toBeInTheDocument(); // Attack stat
  });

  it('shows add button when pokemon is not in team', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={false}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    const addButton = screen.getByTitle('Add to team');
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('shows remove button when pokemon is in team', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={true}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    const removeButton = screen.getByTitle('Remove from team');
    expect(removeButton).toBeInTheDocument();
  });

  it('disables add button when team is full', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={false}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={true}
      />
    );

    const addButton = screen.getByTitle('Team is full (max 6 Pokemon)');
    expect(addButton).toBeDisabled();
  });

  it('calls onAddToTeam when add button is clicked', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={false}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    const addButton = screen.getByTitle('Add to team');
    fireEvent.click(addButton);

    expect(mockOnAddToTeam).toHaveBeenCalledWith(mockPokemon);
  });

  it('calls onRemoveFromTeam when remove button is clicked', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={true}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    const removeButton = screen.getByTitle('Remove from team');
    fireEvent.click(removeButton);

    expect(mockOnRemoveFromTeam).toHaveBeenCalledWith(mockPokemon);
  });

  it('renders pokemon image with correct alt text', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isInTeam={false}
        onAddToTeam={mockOnAddToTeam}
        onRemoveFromTeam={mockOnRemoveFromTeam}
        isTeamFull={false}
      />
    );

    const image = screen.getByAltText('pikachu');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('pikachu-artwork.png'));
  });
});
