'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';
import { formatPokemonName, formatPokemonId, getTypeColor, getStatColor } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
  isInTeam: boolean;
  onAddToTeam: (pokemon: Pokemon) => void;
  onRemoveFromTeam: (pokemon: Pokemon) => void;
  isTeamFull: boolean;
}

export default function PokemonCard({
  pokemon,
  isInTeam,
  onAddToTeam,
  onRemoveFromTeam,
  isTeamFull,
}: PokemonCardProps) {
  const handleAction = () => {
    if (isInTeam) {
      onRemoveFromTeam(pokemon);
    } else {
      onAddToTeam(pokemon);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formatPokemonName(pokemon.name)}
          </h3>
          <p className="text-sm text-gray-600">{formatPokemonId(pokemon.id)}</p>
        </div>
        <button
          onClick={handleAction}
          disabled={!isInTeam && isTeamFull}
          className={`p-2 rounded-full transition-colors ${
            isInTeam
              ? 'bg-red-100 hover:bg-red-200 text-red-600'
              : isTeamFull
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-100 hover:bg-green-200 text-green-600'
          }`}
          title={
            isInTeam
              ? 'Remove from team'
              : isTeamFull
              ? 'Team is full (max 6 Pokemon)'
              : 'Add to team'
          }
        >
          {isInTeam ? <Minus size={20} /> : <Plus size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-center mb-3">
        <Image
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          width={120}
          height={120}
          className="object-contain"
          priority={false}
        />
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Types</h4>
        <div className="flex gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(
                type.type.name
              )}`}
            >
              {formatPokemonName(type.type.name)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Base Stats</h4>
        <div className="space-y-1">
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name} className="flex justify-between items-center">
              <span className={`text-xs font-medium ${getStatColor(stat.stat.name)}`}>
                {stat.stat.name.replace('-', ' ').toUpperCase()}
              </span>
              <span className="text-xs font-bold text-gray-800">{stat.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
