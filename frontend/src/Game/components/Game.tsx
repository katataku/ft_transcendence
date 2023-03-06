import React, { type ReactElement, useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'
import '../assets/styles.css'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import {
  type Vector2,
  type IBall,
  type IMatch,
  type IPaddle,
  type IPlayer,
  type IScore,
  EStatus
} from '../types/game.model'

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const socket = io(ServerURL + '/game')

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

const gameWinHght: number = 600
const ballPx: number = 20
const paddleSpeed: number = 10
let keydown = ''

const paddleSize: Vector2 = {
  x: 8,
  y: 100
}

let selfName: string
let matchID: number

function Paddles(props: {
  leftName: string
  rightName: string
  leftPaddle: IPaddle
  rightPaddle: IPaddle
  status: EStatus
}): ReactElement {
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(props.leftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(props.rightPaddle)
  useEffect(() => {
    socket.on(
      'updatePaddle',
      (data: { leftPaddle: IPaddle; rightPaddle: IPaddle }) => {
        if (props.leftName !== selfName) setLeftPaddle(data.leftPaddle)
        if (props.rightName !== selfName) setRightPaddle(data.rightPaddle)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.leftName === selfName) {
      const newPaddle = updatePaddle(leftPaddle)
      setLeftPaddle(newPaddle)
      socket.emit('updatePaddle', { matchID, newPaddle })
    } else if (props.rightName === selfName) {
      const newPaddle = updatePaddle(rightPaddle)
      setRightPaddle(newPaddle)
      socket.emit('updatePaddle', { matchID, newPaddle })
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
  useEffect(() => {
    socket.on('updateBall', (serverBall: IBall) => {
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

function SpeedPU(props: { leftName: string; status: EStatus }): ReactElement {
  const [title, setTitle] = useState<string>('Difficulty')

  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || selfName !== props.leftName) return
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
    socket.on('updateSpeed', (difficultyTitle: string) => {
      setTitle(difficultyTitle)
    })
  }, [])

  useEffect(() => {
    socket.emit('updateSpeed', { matchID, difficultyTitle: title })
  }, [title])

  return (
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
  )
}

function CountDown(): ReactElement {
  const [timer, setTimer] = useState<number>(0)
  useEffect(() => {
    socket.on('updateCountDown', (seconds: number) => {
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

  useEffect(() => {
    socket.on('updateScore', (serverScore: IScore) => {
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

function Match(props: { match: IMatch }): ReactElement {
  const [status, setStatus] = useState<EStatus>(props.match.status)

  useEffect(() => {
    socket.on('updateStatus', (serverStatus: EStatus) => {
      setStatus(serverStatus)
    })
  }, [])

  return (
    <Col id="centerCol">
      <SpeedPU leftName={props.match.leftPlayer.name} status={status} />
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
            leftName={props.match.leftPlayer.name}
            rightName={props.match.rightPlayer.name}
            leftPaddle={props.match.leftPlayer.paddle}
            rightPaddle={props.match.rightPlayer.paddle}
            status={status}
          />
        )}
      </div>
    </Col>
  )
}

function Ready(props: { player: IPlayer }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)
  const matchState = useLocation().state

  function setReady(): void {
    if (button === grayButton && props.player.name === matchState.userName) {
      setButton(greenButton)
      socket.emit('updatePlayerReady', { matchID, userName: props.player.name })
    }
  }

  if (button === grayButton && props.player.ready) setButton(greenButton)

  return (
    <button type="button" id="buttonPos" className={button} onClick={setReady}>
      Ready
    </button>
  )
}

function Player(props: { player: IPlayer }): ReactElement {
  return (
    <Col>
      <div className="display-1">{props.player.name.slice(0, 7)}</div>
      <div className="border">
        <h3>Match History</h3>
        <h5>
          wins:<span className="text-success">{props.player.wins} </span>
          losses:<span className="text-danger">{props.player.losses}</span>
        </h5>
      </div>
      <Ready player={props.player} />
    </Col>
  )
}

function Matching(props: { hasResponse: boolean }): ReactElement {
  const matchState = useLocation().state
  const [showSpinner, setShowSpinner] = useState(false)
  const [matchFound, setMatchFound] = useState(false)

  useEffect(() => {
    socket.on('matchFound', () => {
      setMatchFound(true)
    })
  }, [])

  const handleClick = (): void => {
    setShowSpinner(true)
    socket.emit('matching', {
      userId: matchState.userId,
      userName: matchState.userName
    })
  }

  const handleCancel = (): void => {
    setShowSpinner(false)
    socket.emit('matchingCancel', matchState.userName)
  }

  return (
    <div>
      {props.hasResponse && (
        <Button onClick={handleClick} disabled={showSpinner}>
          {showSpinner ? (
            <div>
              <Spinner animation="border" /> matching...
            </div>
          ) : (
            'play'
          )}
        </Button>
      )}
      {showSpinner && !matchFound && (
        <Button variant="danger" onClick={handleCancel}>
          cancel
        </Button>
      )}
    </div>
  )
}

export function Game(): ReactElement {
  const matchState = useLocation().state
  console.log(matchState)

  const [match, setMatch] = useState<IMatch | undefined>(undefined)
  const [hasResponse, setHasResponse] = useState<boolean>(false)

  useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent): void => {
      keydown = e.code
    }
    const handleOnKeyUp = (): void => {
      keydown = ''
    }
    window.addEventListener('keydown', handleOnKeyDown)
    window.addEventListener('keyup', handleOnKeyUp)
    socket.on('updateConnections', (serverMatch: IMatch) => {
      setMatch(serverMatch)
      setHasResponse(true)
      if (serverMatch === undefined) return
      matchID = serverMatch.id
    })
    selfName = matchState.userName
    socket.emit('updateConnections', {
      matchID: matchState.matchId,
      userName: selfName
    })
  }, [])

  return match === undefined ||
    match.leftPlayer === undefined ||
    match.rightPlayer === undefined ? (
    <Matching hasResponse={hasResponse} />
  ) : (
    <Container>
      <h1>match.id: {match.id}</h1>
      <Row id="header">
        <Player player={match.leftPlayer} />
        <Player player={match.rightPlayer} />
      </Row>
      <Row>
        <Match match={match} />
      </Row>
    </Container>
  )
}
