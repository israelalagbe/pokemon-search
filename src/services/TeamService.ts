import axios from 'axios';
import type { Pokemon, TeamStats, ApiError } from '@/types/pokemon';
import { TeamEvaluationError } from '@/errors';

const API_BASE_URL = '/api';

/**
 * Service for team-related operations
 */
export class TeamService {
  /**
   * Evaluate a Pokemon team's effectiveness
   */
  static async evaluateTeam(team: Pokemon[]): Promise<TeamStats> {
    try {
      const response = await axios.post(`${API_BASE_URL}/team/evaluate`, { team });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Failed to evaluate team',
          status: error.response?.status,
        };
        throw new TeamEvaluationError(apiError.message, error);
      }
      throw new TeamEvaluationError('Network error occurred', error as Error);
    }
  }

  /**
   * Get team recommendations based on current team
   */
  static async getTeamRecommendations(team: Pokemon[]): Promise<Pokemon[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/team/recommendations`, { team });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Failed to get team recommendations',
          status: error.response?.status,
        };
        throw new TeamEvaluationError(apiError.message, error);
      }
      throw new TeamEvaluationError('Network error occurred', error as Error);
    }
  }
}
