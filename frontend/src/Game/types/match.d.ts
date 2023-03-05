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
}

interface IScore {
  left: number
  right: number
}
