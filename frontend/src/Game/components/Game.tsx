import React, { type ReactElement, useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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

let selfID: string
let selfName: string

function Paddles(props: {
  leftSocketID: string
  rightSocketID: string
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
        if (props.leftSocketID !== selfID) setLeftPaddle(data.leftPaddle)
        if (props.rightSocketID !== selfID) setRightPaddle(data.rightPaddle)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.leftSocketID === selfID) {
      const newPaddle = updatePaddle(leftPaddle)
      setLeftPaddle(newPaddle)
      socket.emit('updatePaddle', newPaddle)
    } else if (props.rightSocketID === selfID) {
      const newPaddle = updatePaddle(rightPaddle)
      setRightPaddle(newPaddle)
      socket.emit('updatePaddle', newPaddle)
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

function SpeedPU(props: { leftID: string; status: EStatus }): ReactElement {
  const [title, setTitle] = useState<string>('Difficulty')

  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || selfID !== props.leftID) return
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
    socket.emit('updateSpeed', title)
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

function Ready(props: { player: IPlayer }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)
  const matchState = useLocation().state

  function setReady(): void {
    if (
      props.player.socketID === selfID &&
      button === grayButton &&
      selfName === matchState.userName
    ) {
      setButton(greenButton)
      socket.emit('updatePlayerReady', props.player.socketID)
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

function Matching(): ReactElement {
  function findMatch(): void {
    socket.emit('updateConnections')
  }

  return (
    <div>
      <h1>matching...</h1>
      <button onClick={findMatch}>updateMatch</button>
    </div>
  )
}

export function Game(): ReactElement {
  const matchState = useLocation().state
  console.log(matchState)

  const [match, setMatch] = useState<IMatch | undefined>(undefined)

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
    })
    selfName = matchState.userName
    socket.emit('updateConnections')
  }, [])

  return match === undefined ||
    match.leftPlayer === undefined ||
    match.rightPlayer === undefined ? (
    <Matching />
  ) : (
    <Container>
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

// 接続時
socket.on('connect', () => {
  selfID = socket.id
})
