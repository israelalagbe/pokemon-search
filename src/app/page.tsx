'use client';

import React, { useState, useEffect } from 'react';
import { PokemonService, TeamService, TeamStorageService } from '@/services';
import { RequestCancelledError } from '@/errors';
import { isPokemonInTeam } from '@/lib/utils';
import type { Pokemon, TeamStats, ApiError } from '@/types/pokemon';
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import TeamDisplay from '@/components/TeamDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedTeam = TeamStorageService.loadTeam();
    setTeam(savedTeam);
    if (savedTeam.length > 0) {
      evaluateTeam(savedTeam);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    TeamStorageService.saveTeam(team);
    if (team.length > 0) {
      evaluateTeam(team);
    } else {
      setTeamStats(null);
    }
  }, [team, isHydrated]);

  const handleSearch = async (query: string, signal: AbortSignal) => {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await PokemonService.searchPokemon(query, signal);
      setSearchResults(results);
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return;
      }
      const apiError = error as ApiError;
      setError(apiError.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const evaluateTeam = async (currentTeam: Pokemon[]) => {
    if (currentTeam.length === 0) {
      setTeamStats(null);
      return;
    }

    setIsEvaluating(true);
    try {
      const stats = await TeamService.evaluateTeam(currentTeam);
      setTeamStats(stats);
    } catch (error) {
      console.error('Failed to evaluate team:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const addToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) {
      setError('Team is full! Maximum 6 Pokémon allowed.');
      return;
    }

    if (isPokemonInTeam(pokemon, team)) {
      setError('This Pokémon is already in your team!');
      return;
    }

    setTeam(prevTeam => [...prevTeam, pokemon]);
    setError(null);
  };

  const removeFromTeam = (pokemon: Pokemon) => {
    setTeam(prevTeam => prevTeam.filter(p => p.id !== pokemon.id));
    setError(null);
  };

  const clearTeam = () => {
    setTeam([]);
    setTeamStats(null);
    TeamStorageService.clearTeam();
    setError(null);
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PokéTeam Builder</h1>
          <p className="text-lg text-gray-600">
            Build and optimize your perfect Pokémon team with detailed analysis
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={dismissError} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {hasSearched ? 'Search Results' : 'Featured Pokémon'}
            </h2>
            
            {isSearching ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <LoadingSpinner size={32} className="py-8" />
                <p className="text-center text-gray-600 mt-4">Searching for Pokémon...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isInTeam={isPokemonInTeam(pokemon, team)}
                    onAddToTeam={addToTeam}
                    onRemoveFromTeam={removeFromTeam}
                    isTeamFull={team.length >= 6}
                  />
                ))}
              </div>
            ) : hasSearched ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">
                  No Pokémon found. Try searching by name (e.g., "pikachu") or ID (e.g., "25").
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Search for Pokémon by name or ID to get started!
                </p>
                <p className="text-sm text-gray-500">
                  Examples: "pikachu", "charizard", "150", or partial names like "char"
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {isEvaluating && (
                <div className="mb-4">
                  <LoadingSpinner size={20} />
                  <p className="text-sm text-gray-600 text-center mt-2">Evaluating team...</p>
                </div>
              )}
              <TeamDisplay
                team={isHydrated ? team : []}
                teamStats={isHydrated ? teamStats : null}
                onRemoveFromTeam={removeFromTeam}
                onClearTeam={clearTeam}
              />
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Data provided by{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              PokéAPI
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
