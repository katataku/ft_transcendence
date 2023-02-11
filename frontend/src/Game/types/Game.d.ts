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
}

interface IScore {
  leftScore: number
  rightScore: number
}

type UPlayer = 'left' | 'right'

interface IPlayer {
  id: number
  name: string
  wins: number
  losses: number
}
