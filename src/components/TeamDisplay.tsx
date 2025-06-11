'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Users } from 'lucide-react';
import type { Pokemon, TeamStats } from '@/types/pokemon';
import { formatPokemonName, formatPokemonId, getTypeColor, getTeamScoreDescription } from '@/lib/utils';

interface TeamDisplayProps {
  team: Pokemon[];
  teamStats: TeamStats | null;
  onRemoveFromTeam: (pokemon: Pokemon) => void;
  onClearTeam: () => void;
}

export default function TeamDisplay({
  team,
  teamStats,
  onRemoveFromTeam,
  onClearTeam,
}: TeamDisplayProps) {
  if (team.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Pokemon in team</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for Pokemon and add them to your team to get started.
          </p>
        </div>
      </div>
    );
  }

  const scoreInfo = teamStats ? getTeamScoreDescription(teamStats.teamScore) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Your Team ({team.length}/6)
        </h2>
        <button
          onClick={onClearTeam}
          className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 size={16} />
          Clear Team
        </button>
      </div>

      {/* Team Stats */}
      {teamStats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Team Analysis</h3>
            {scoreInfo && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{teamStats.teamScore}</div>
                <div className={`text-sm font-medium ${scoreInfo.color}`}>
                  {scoreInfo.description}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg HP</div>
              <div className="text-lg font-bold text-red-600">{teamStats.averageHp}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Attack</div>
              <div className="text-lg font-bold text-orange-600">{teamStats.averageAttack}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Defense</div>
              <div className="text-lg font-bold text-blue-600">{teamStats.averageDefense}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Sp. Atk</div>
              <div className="text-lg font-bold text-purple-600">{teamStats.averageSpAttack}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Sp. Def</div>
              <div className="text-lg font-bold text-green-600">{teamStats.averageSpDefense}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Speed</div>
              <div className="text-lg font-bold text-yellow-600">{teamStats.averageSpeed}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">
              Type Coverage ({teamStats.uniqueTypes.length} unique types)
            </div>
            <div className="flex flex-wrap gap-2">
              {teamStats.uniqueTypes.map((type) => (
                <span
                  key={type}
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(type)}`}
                >
                  {formatPokemonName(type)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-800">
                  {formatPokemonName(pokemon.name)}
                </h4>
                <p className="text-xs text-gray-600">{formatPokemonId(pokemon.id)}</p>
              </div>
              <button
                onClick={() => onRemoveFromTeam(pokemon)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Remove from team"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center justify-center mb-2">
              <Image
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>

            <div className="flex gap-1 justify-center">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`px-1.5 py-0.5 rounded text-white text-xs ${getTypeColor(
                    type.type.name
                  )}`}
                >
                  {formatPokemonName(type.type.name)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
