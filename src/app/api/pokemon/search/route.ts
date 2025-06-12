import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import type { Pokemon, PokemonSearchResponse } from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { message: 'Search query is required' },
        { status: 400 }
      );
    }

    const isNumericId = /^\d+$/.test(query);
    
    if (isNumericId) {
      try {
        const response = await axios.get<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${query}`);
        return NextResponse.json([response.data]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return NextResponse.json(
            { message: 'Pokemon not found' },
            { status: 404 }
          );
        }
        throw error;
      }
    } else {
      const lowerQuery = query.toLowerCase();
      
      try {
        const response = await axios.get<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${lowerQuery}`);
        return NextResponse.json([response.data]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          try {
            const allPokemonResponse = await axios.get<PokemonSearchResponse>(
              `${POKEAPI_BASE_URL}/pokemon?limit=1000`
            );
            
            const matchingPokemon = allPokemonResponse.data.results.filter(pokemon =>
              pokemon.name.includes(lowerQuery)
            ).slice(0, 10); // Limit to 10 results

            if (matchingPokemon.length === 0) {
              return NextResponse.json(
                { message: 'No Pokemon found matching your search' },
                { status: 404 }
              );
            }

            const pokemonDetails = await Promise.all(
              matchingPokemon.map(async (pokemon) => {
                const detailResponse = await axios.get<Pokemon>(pokemon.url);
                return detailResponse.data;
              })
            );

            return NextResponse.json(pokemonDetails);
          } catch (searchError) {
            console.error('Error searching Pokemon:', searchError);
            return NextResponse.json(
              { message: 'Error searching Pokemon' },
              { status: 500 }
            );
          }
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in Pokemon search API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
