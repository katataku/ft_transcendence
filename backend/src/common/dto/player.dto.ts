export class CreatePlayerDto {
  id: number;
  user_name: string;
  matches: number;
  wins: number;
  losses: number;
  powerups: number;
  win_streak: number;
}
