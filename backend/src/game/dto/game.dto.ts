export interface Vector2 {
  x: number;
  y: number;
}

// export interface ballDto {
//   pos: Vector2;
//   vel: Vector2;
// }
export interface IBall {
  pos: Vector2;
  vel: Vector2;
}

export interface IPaddle {
  id: UPlayer;
  pos: Vector2;
  score: number;
  ready: boolean;
}

export interface IScore {
  leftScore: number;
  rightScore: number;
}

export type UPlayer = 'left' | 'right';

interface IPlayer {
  id: UPlayer;
  name: string;
  wins: number;
  losses: number;
  isReady: boolean;
  paddle: IPaddle;
}
