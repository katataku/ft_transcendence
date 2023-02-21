interface Vector2 {
  x: number
  y: number
}

interface IBall {
  pos: Vector2
  vel: Vector2
}

interface IPaddle {
  id: UPlayer
  pos: Vector2
  score: number
}

interface IScore {
  left: number
  right: number
}

type UPlayer = 'left' | 'right'

interface IPlayer {
  id: numer
  name: string
  side: UPlayer
  wins: number
  losses: number
  ready: boolean
}

interface IMatch {
  p1: IPlayer
  p2: IPlayer
  /*  winner: IPlayer
  start: number
  end: number */
}
