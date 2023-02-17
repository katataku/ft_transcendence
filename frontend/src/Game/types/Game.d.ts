interface Vector2 {
  x: number
  y: number
}

interface IBall {
  pos: Vector2
  vel: Vector2
}

interface IPaddle {
  pos: Vector2
  id: UPlayer
  score: number
}

interface IScore {
  leftScore: number
  rightScore: number
}

type UPlayer = 'left' | 'right'
