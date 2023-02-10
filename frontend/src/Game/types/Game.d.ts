export interface Vector2 {
  x: number
  y: number
}

export interface IBall {
  pos: Vector2
  vel: Vector2
}

export interface IPaddle {
  pos: Vector2
}

export interface IScore {
  leftScore: number
  rightScore: number
}

export type UPlayer = 'left' | 'right'
