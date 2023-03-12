interface IPlayer {
  id: UPlayer
  socketID: string
  name: string
  matchHistory: UserMatchHistoryDto
  ready: boolean
  score: number
  paddle: IPaddle
}

interface IMatch {
  id: number
  leftPlayer: IPlayer
  rightPlayer: IPlayer
  ball: IBall
  speed: number
  status: EStatus
}
