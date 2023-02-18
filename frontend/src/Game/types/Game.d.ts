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
  left: number
  right: number
}

type UPlayer = 'left' | 'right'

interface IPlayer {
  id: number
  name: string
  wins: number
  losses: number
  ready: boolean
}

interface IMatch {
  p1: IPlayer
  p2: IPlayer
}
