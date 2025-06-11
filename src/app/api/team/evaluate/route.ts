import { NextRequest, NextResponse } from 'next/server';
import type { Pokemon, TeamStats } from '@/types/pokemon';

export async function POST(request: NextRequest) {
  try {
    const { team }: { team: Pokemon[] } = await request.json();

    if (!Array.isArray(team)) {
      return NextResponse.json(
        { message: 'Team must be an array of Pokemon' },
        { status: 400 }
      );
    }

    if (team.length === 0) {
      return NextResponse.json(
        { message: 'Team cannot be empty' },
        { status: 400 }
      );
    }

    if (team.length > 6) {
      return NextResponse.json(
        { message: 'Team cannot have more than 6 Pokemon' },
        { status: 400 }
      );
    }

    // Calculate team statistics
    const teamStats = calculateTeamStats(team);

    return NextResponse.json(teamStats);
  } catch (error) {
    console.error('Error in team evaluation API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateTeamStats(team: Pokemon[]): TeamStats {
  // Calculate average stats
  const totalStats = team.reduce(
    (acc, pokemon) => {
      pokemon.stats.forEach(stat => {
        switch (stat.stat.name) {
          case 'hp':
            acc.hp += stat.base_stat;
            break;
          case 'attack':
            acc.attack += stat.base_stat;
            break;
          case 'defense':
            acc.defense += stat.base_stat;
            break;
          case 'special-attack':
            acc.spAttack += stat.base_stat;
            break;
          case 'special-defense':
            acc.spDefense += stat.base_stat;
            break;
          case 'speed':
            acc.speed += stat.base_stat;
            break;
        }
      });
      return acc;
    },
    { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
  );

  const teamSize = team.length;
  const averageHp = totalStats.hp / teamSize;
  const averageAttack = totalStats.attack / teamSize;
  const averageDefense = totalStats.defense / teamSize;
  const averageSpAttack = totalStats.spAttack / teamSize;
  const averageSpDefense = totalStats.spDefense / teamSize;
  const averageSpeed = totalStats.speed / teamSize;

  // Get unique types
  const allTypes = team.flatMap(pokemon => 
    pokemon.types.map(type => type.type.name)
  );
  const uniqueTypes = [...new Set(allTypes)];

  // Calculate team score based on the requirements
  let teamScore = 0;

  // +10 points for each unique Pokemon type
  teamScore += uniqueTypes.length * 10;

  // +5 points if average HP > 80
  if (averageHp > 80) {
    teamScore += 5;
  }

  // +5 points if no duplicate types (unique types == total types)
  if (uniqueTypes.length === allTypes.length) {
    teamScore += 5;
  }

  // -5 points if average speed < 50
  if (averageSpeed < 50) {
    teamScore -= 5;
  }

  return {
    averageHp: Math.round(averageHp),
    averageAttack: Math.round(averageAttack),
    averageDefense: Math.round(averageDefense),
    averageSpAttack: Math.round(averageSpAttack),
    averageSpDefense: Math.round(averageSpDefense),
    averageSpeed: Math.round(averageSpeed),
    uniqueTypes,
    teamScore
  };
}
