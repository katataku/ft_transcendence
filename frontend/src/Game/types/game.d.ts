interface IPlayer {
  id: UPlayer
  socketID: string
  name: string
  matchHistory: UserMatchHistoryDto
  ready: boolean
  score: number
  paddle: IPaddle
}

interface IMatchSettings {
  winWid: number
  winHght: number
  ballPx: number
  paddleSpeed: number
  winScore: { desc: string; value: number }
  paddleSize: { desc: string; value: Vector2 }
  ballSpeed: { desc: string; value: number }
}

interface IMatch {
  id: number
  leftPlayer: IPlayer
  rightPlayer: IPlayer
  ball: IBall
  status: EStatus
  settings: IMatchSettings
}
