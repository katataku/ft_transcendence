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
  pos: Vector2;
  id: UPlayer;
  score: number;
}

export interface IScore {
  leftScore: number;
  rightScore: number;
}

export type UPlayer = 'left' | 'right';
