import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { EStatus } from '../../types/game.model'
import { Col } from 'react-bootstrap'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { SpeedPU } from './SpeedPU'
import { Paddles } from './Paddle'
import { Ball } from './Ball'

function Result(props: { match: IMatch }): ReactElement {
  const winner =
    props.match.leftPlayer.score > props.match.rightPlayer.score
      ? 'left'
      : 'right'

  return <div id={`${winner}Result`}>WIN</div>
}

function CountDown(): ReactElement {
  const [timer, setTimer] = useState<number>(0)
  const gameSocket = useContext(GameSocketContext)
  useEffect(() => {
    gameSocket.on('updateCountDown', (seconds: number) => {
      setTimer(seconds)
    })
  }, [])

  return <div>{timer !== 0 && timer}</div>
}

function Score(props: { match: IMatch }): ReactElement {
  const [scores, setScores] = useState<IScore>({
    left: props.match.leftPlayer.score,
    right: props.match.rightPlayer.score
  })
  const gameSocket = useContext(GameSocketContext)

  useEffect(() => {
    gameSocket.on('updateScore', (serverScore: IScore) => {
      setScores(serverScore)
    })
  }, [])

  return (
    <>
      <div id="leftScore">{scores.left}</div>
      <div id="rightScore">{scores.right}</div>
    </>
  )
}

export function Match(props: { match: IMatch }): ReactElement {
  const [status, setStatus] = useState<EStatus>(props.match.status)
  const gameSocket = useContext(GameSocketContext)

  useEffect(() => {
    gameSocket.on('updateStatus', (serverStatus: EStatus) => {
      setStatus(serverStatus)
    })
  }, [])

  return (
    <Col id="centerCol">
      <SpeedPU leftID={props.match.leftPlayer.socketID} status={status} />
      <div id="match">
        <div id="boardDiv" />
        <Score match={props.match} />
        <div id="countDown">{status === EStatus.ready && <CountDown />}</div>
        {status === EStatus.play && <Ball ball={props.match.ball} />}
        {status === EStatus.set && <Result match={props.match} />}
        {status !== EStatus.none && (
          <Paddles match={props.match} status={status} />
        )}
      </div>
    </Col>
  )
}
