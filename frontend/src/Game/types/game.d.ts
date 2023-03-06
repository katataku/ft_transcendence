interface IPlayer {
  id: UPlayer
  socketID: string
  name: string
  wins: number
  losses: number
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
