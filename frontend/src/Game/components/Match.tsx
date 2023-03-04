import axios from 'axios'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { EStatus } from '../types/game.model'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'
import { DropdownButton, Dropdown, Col } from 'react-bootstrap'
import { GameSocketContext } from '../utils/gameSocketContext'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

const gameWinHght: number = 500
const ballPx: number = 20
const paddleSpeed: number = 10
let keydown = ''

const paddleSize: Vector2 = {
  x: 8,
  y: 100
}

function Paddles(props: {
  leftSocketID: string
  rightSocketID: string
  leftPaddle: IPaddle
  rightPaddle: IPaddle
  status: EStatus
}): ReactElement {
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(props.leftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(props.rightPaddle)
  const gameSocket = useContext(GameSocketContext)
  useEffect(() => {
    gameSocket.on(
      'updatePaddle',
      (data: { leftPaddle: IPaddle; rightPaddle: IPaddle }) => {
        if (props.leftSocketID !== gameSocket.id) setLeftPaddle(data.leftPaddle)
        if (props.rightSocketID !== gameSocket.id)
          setRightPaddle(data.rightPaddle)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.leftSocketID === gameSocket.id) {
      const newPaddle = updatePaddle(leftPaddle)
      setLeftPaddle(newPaddle)
      gameSocket.emit('updatePaddle', newPaddle)
    } else if (props.rightSocketID === gameSocket.id) {
      const newPaddle = updatePaddle(rightPaddle)
      setRightPaddle(newPaddle)
      gameSocket.emit('updatePaddle', newPaddle)
    }
  }, props.status === EStatus.set)

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          width: `${paddleSize.x}px`,
          height: `${paddleSize.y}px`,
          position: 'absolute',
          top: `${leftPaddle.pos.y}px`,
          left: `${leftPaddle.pos.x}px`
        }}
        id="paddle"
      />
      <div
        style={{
          backgroundColor: 'white',
          width: `${paddleSize.x}px`,
          height: `${paddleSize.y}px`,
          position: 'absolute',
          top: `${rightPaddle.pos.y}px`,
          left: `${rightPaddle.pos.x}px`
        }}
        id="paddle"
      />
    </>
  )
}

function Ball(props: { ball: IBall }): ReactElement {
  const [ball, setBall] = useState<IBall>(props.ball)
  const gameSocket = useContext(GameSocketContext)
  useEffect(() => {
    gameSocket.on('updateBall', (serverBall: IBall) => {
      setBall(serverBall)
    })
  }, [])

  return (
    <div
      style={{
        width: `${ballPx}px`,
        height: `${ballPx}px`,
        top: `${ball.pos.y}px`,
        left: `${ball.pos.x}px`,
        position: 'absolute',
        backgroundColor: 'white'
      }}
      id="ball"
    />
  )
}

function updatePaddle(paddle: IPaddle): IPaddle {
  switch (keydown) {
    case 'ArrowUp':
      if (paddle.pos.y >= paddleSpeed) paddle.pos.y += -paddleSpeed
      break
    case 'ArrowDown':
      if (paddle.pos.y <= gameWinHght - paddleSize.y - paddleSpeed) {
        paddle.pos.y += paddleSpeed
      }
      break
    default:
      break
  }
  return paddle
}

function Result(props: { score: IScore }): ReactElement {
  const winner = props.score.left > props.score.right ? 'left' : 'right'

  return <div id={`${winner}Result`}>WIN</div>
}

function SpeedPU(props: { leftID: string; status: EStatus }): ReactElement {
  const [title, setTitle] = useState<string>('Difficulty')
  const gameSocket = useContext(GameSocketContext)
  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || gameSocket.id !== props.leftID) return
    switch (op) {
      case 'easy':
        setTitle('Easy')
        break
      case 'medium':
        setTitle('Medium')
        break
      case 'hard':
        setTitle('Hard')
        break
    }
  }

  useEffect(() => {
    gameSocket.on('updateSpeed', (difficultyTitle: string) => {
      setTitle(difficultyTitle)
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updateSpeed', title)
  }, [title])

  return (
    <div id="buttonPos">
      <DropdownButton
        id="dropdown-basic-button"
        variant="info"
        title={title}
        onSelect={modifySpeed}
      >
        <Dropdown.Item eventKey="easy">Easy</Dropdown.Item>
        <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
        <Dropdown.Item eventKey="hard">Hard</Dropdown.Item>
      </DropdownButton>
    </div>
  )
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

function Score(props: { left: number; right: number }): ReactElement {
  const [scores, setScores] = useState<IScore>({
    left: props.left,
    right: props.right
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
    const handleOnKeyDown = (e: KeyboardEvent): void => {
      keydown = e.code
    }
    const handleOnKeyUp = (): void => {
      keydown = ''
    }
    window.addEventListener('keydown', handleOnKeyDown)
    window.addEventListener('keyup', handleOnKeyUp)
    gameSocket.on('updateStatus', (serverStatus: EStatus) => {
      setStatus(serverStatus)
    })
  }, [])

  return (
    <Col id="centerCol">
      <SpeedPU leftID={props.match.leftPlayer.socketID} status={status} />
      <div id="match">
        <div id="boardDiv"></div>
        <Score
          left={props.match.leftPlayer.score}
          right={props.match.rightPlayer.score}
        />
        <div id="countDown">{status === EStatus.ready && <CountDown />}</div>
        {status === EStatus.play && <Ball ball={props.match.ball} />}
        {status === EStatus.set && (
          <Result
            score={{
              left: props.match.leftPlayer.score,
              right: props.match.rightPlayer.score
            }}
          />
        )}
        {status !== EStatus.none && (
          <Paddles
            leftSocketID={props.match.leftPlayer.socketID}
            rightSocketID={props.match.rightPlayer.socketID}
            leftPaddle={props.match.leftPlayer.paddle}
            rightPaddle={props.match.rightPlayer.paddle}
            status={status}
          />
        )}
      </div>
    </Col>
  )
}
