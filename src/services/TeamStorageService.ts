import type { Pokemon } from '@/types/pokemon';
import { LocalStorageService } from './LocalStorageService';

export class TeamStorageService {
  private static readonly TEAM_KEY = 'pokemon-team';
  private static readonly PREFERENCES_KEY = 'pokemon-preferences';

  static saveTeam(team: Pokemon[]): void {
    LocalStorageService.save(this.TEAM_KEY, team);
  }

  static loadTeam(): Pokemon[] {
    return LocalStorageService.load<Pokemon[]>(this.TEAM_KEY, []);
  }

  static clearTeam(): void {
    LocalStorageService.remove(this.TEAM_KEY);
  }

  static savePreferences(preferences: Record<string, any>): void {
    LocalStorageService.save(this.PREFERENCES_KEY, preferences);
  }

  static loadPreferences(): Record<string, any> {
    return LocalStorageService.load<Record<string, any>>(this.PREFERENCES_KEY, {});
  }

  static clearPreferences(): void {
    LocalStorageService.remove(this.PREFERENCES_KEY);
  }

  static hasTeam(): boolean {
    return LocalStorageService.exists(this.TEAM_KEY);
  }

  static getTeamSize(): number {
    const team = this.loadTeam();
    return team.length;
  }
}
