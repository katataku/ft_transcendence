import React, { type ReactElement, useState, useRef, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'
import '../assets/styles.css'
import io from 'socket.io-client'
import axios from 'axios'
type Ref = React.MutableRefObject<any>
type Setter = React.Dispatch<React.SetStateAction<any>>

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const socket = io(ServerURL + '/game')

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

const gameWinWid: number = 1000
const gameWinHght: number = 600
const ballPx: number = 20
const paddleSpeed: number = 10
const winningScore = 3
let gtimer: number = 0
let keydown = ''

enum EStatus {
  none = 0,
  ready = 1,
  play = 2,
  pause = 3,
  set = 4
}

const paddleSize: Vector2 = {
  x: 8,
  y: 100
}

const initBall: IBall = {
  pos: { x: gameWinWid / 2 - ballPx / 2, y: gameWinHght / 2 - ballPx / 2 },
  vel: { x: -1, y: 0.5 }
}

const initLeftPaddle: IPaddle = {
  id: 'left',
  pos: { x: gameWinWid / 20, y: gameWinHght / 2 - paddleSize.y / 2 },
  score: 0
}

const initRightPaddle: IPaddle = {
  id: 'right',
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2
  },
  score: 0
}

const deepCpInitBall = (): IBall => {
  return JSON.parse(JSON.stringify(initBall)) // deep copy of Object
}

let clientBall: IBall
let clientPlayersPaddle: Map<string, IPaddle>
let clientPlayersProfile: Map<string, IPlayer>

let leftID: string
let rightID: string
let selfID: string

function Paddle(props: { paddle: IPaddle }): ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: `${paddleSize.x}px`,
        height: `${paddleSize.y}px`,
        position: 'absolute',
        top: `${props.paddle.pos.y}px`,
        left: `${props.paddle.pos.x}px`
      }}
      id="paddle"
    />
  )
}

function Ball(props: { ball: IBall }): ReactElement {
  return (
    <div
      style={{
        width: `${ballPx}px`,
        height: `${ballPx}px`,
        top: `${props.ball.pos.y}px`,
        left: `${props.ball.pos.x}px`,
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

function SpeedPU(props: { speed: Ref; status: Ref }): ReactElement {
  const [title, setTitle] = useState<string>('Difficulty')

  const modifySpeed = (
    op: string | null,
    e: React.SyntheticEvent<unknown>
  ): void => {
    if (props.status.current !== EStatus.none || selfID !== leftID) return
    switch (op) {
      case 'easy':
        props.speed.current = 400
        setTitle('Easy')
        break
      case 'medium':
        props.speed.current = 600
        setTitle('Medium')
        break
      case 'hard':
        props.speed.current = 800
        setTitle('Hard')
        break
    }
    socket.emit('updateSpeed', props.speed.current)
  }

  useEffect(() => {
    socket.on('updateSpeed', (serverSpeed: number) => {
      switch (serverSpeed) {
        case 400:
          setTitle('Easy')
          break
        case 600:
          setTitle('Medium')
          break
        case 800:
          setTitle('Hard')
          break
      }
    })
  }, [])

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

function CountDown(props: { ticks: number; status: Ref }): ReactElement {
  const oneSecond = useRef<number>(0)
  const prevTicks = useRef<number>(0)
  const timer = useRef<number>(4)
  // let timer: number = 0
  const didLogRef = useRef<boolean>(false)

  //   oneSecond.current += props.ticks - prevTicks.current
  //   prevTicks.current = props.ticks

  //   if (oneSecond.current >= 1000) {
  //     oneSecond.current = 0
  //     timer.current--
  //   }
  //   if (timer.current === 0) {
  //     props.status.current = EStatus.play
  //   }
  // console.log('countDown')
  // useEffect(() => {
  //   if (!didLogRef.current) {
  //     console.log('useEffect')
  //     didLogRef.current = true
  //     socket.on('updateCountDown', (seconds: number) => {
  //       console.log(`updateCountDown: ${seconds}`)
  //       timer = seconds
  //     })
  //   }
  // }, [])

  //   return <div>{timer.current !== 0 && timer.current}</div>
  return <div>{gtimer !== 0 && gtimer}</div>
}

function updateScore(score: Ref): void {
  const lp = clientPlayersPaddle.get(leftID)
  const rp = clientPlayersPaddle.get(rightID)
  if (lp !== undefined) score.current.left = lp.score
  if (rp !== undefined) score.current.right = rp.score
}

function Match(props: { p1: IPlayer; p2: IPlayer }): ReactElement {
  const [ticks, setTicks] = useState<number>(0)
  const [ball, setBall] = useState<IBall>(deepCpInitBall())
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(initLeftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(initRightPaddle)
  const waitTime = useRef<number>(0)
  const score = useRef<IScore>({ left: 0, right: 0 })
  const status = useRef<number>(EStatus.none)
  const speed = useRef<number>(400)
  const incrementScore = useRef<(player: UPlayer) => void>((player) => {
    status.current = EStatus.pause
    if (player === 'left') {
      score.current.left++
    } else if (player === 'right') {
      score.current.right++
    }
  })
  const didLogRef = useRef<boolean>(false)

  if (props.p1.ready && props.p2.ready && status.current === EStatus.none) {
    status.current = EStatus.ready
  }

  //   if (status.current === EStatus.pause) {
  //     if (waitTime.current === 0) {
  //       waitTime.current = ticks + 900
  //     }
  //     if (ticks >= waitTime.current) {
  //       waitTime.current = 0
  //       status.current = EStatus.play
  //     }
  //   }

  updateScore(score)
  //   そのcallbackはupdateGame()のような関数です
  useAnimationFrame((time: number) => {
    if (status.current === EStatus.play || status.current === EStatus.pause) {
      if (clientBall !== undefined) setBall(clientBall)
      if (clientPlayersPaddle !== undefined) {
        const myPaddle = clientPlayersPaddle.get(selfID)
        if (myPaddle !== undefined) {
          const newMyPaddle = updatePaddle(myPaddle)
          clientPlayersPaddle.set(selfID, newMyPaddle)
          socket.emit('updatePaddle', newMyPaddle)
        }

        clientPlayersPaddle.forEach((value) => {
          if (value.id === 'left') {
            setLeftPaddle(value)
          } else if (value.id === 'right') {
            setRightPaddle(value)
          }
        })
      }
    }
    setTicks(time)
  }, status.current === EStatus.set)

  useEffect(() => {
    if (!didLogRef.current) {
      didLogRef.current = true
      socket.on('matchSet', () => {
        status.current = EStatus.set
      })
      socket.on('matchStart', () => {
        status.current = EStatus.play
      })
      socket.on('matchPause', () => {
        console.log('matchPause')

        status.current = EStatus.pause
      })
    }
  }, [])

  return (
    <Col id="centerCol">
      <SpeedPU speed={speed} status={status} />
      <div id="match">
        <div id="boardDiv"></div>
        <div id="leftScore">{score.current.left}</div>
        <div id="rightScore">{score.current.right}</div>
        <div id="countDown">
          {status.current === EStatus.ready && (
            <CountDown ticks={ticks} status={status} />
          )}
        </div>
        {status.current === EStatus.play && <Ball ball={ball} />}
        {status.current === EStatus.set && <Result score={score.current} />}
        <Paddle paddle={leftPaddle} />
        <Paddle paddle={rightPaddle} />
      </div>
    </Col>
  )
}

function Ready(props: { player: IPlayer; setPlayer: Setter }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)

  function setReady(): void {
    let isPlayer: boolean
    if (props.player.id === 'left') isPlayer = leftID === selfID
    else isPlayer = rightID === selfID
    if (isPlayer && button === grayButton) {
      setButton(greenButton)
      props.setPlayer({ ...props.player, ready: true })
      socket.emit('updatePlayerReady', props.player.id)
    }
  }

  if (button === grayButton && props.player.ready) setButton(greenButton)

  return (
    <button type="button" id="buttonPos" className={button} onClick={setReady}>
      Ready
    </button>
  )
}

function Player(props: { player: IPlayer; setPlayer: Setter }): ReactElement {
  return (
    <Col>
      <div className="display-1">
        {props.player.id === 'left' ? leftID.slice(0, 7) : rightID.slice(0, 7)}
      </div>
      <div className="border">
        <h2>Match History</h2>
        <h4>
          wins:<span className="text-success">{props.player.wins} </span>
          losses:<span className="text-danger">{props.player.losses}</span>
        </h4>
      </div>
      <Ready player={props.player} setPlayer={props.setPlayer} />
    </Col>
  )
}

function Matching(props: { setPlayerList: Setter }): ReactElement {
  function findMatch(): void {
    props.setPlayerList(clientPlayersPaddle)
  }

  return (
    <div>
      <h1>matching...</h1>
      <button onClick={findMatch}>updateMatch</button>
    </div>
  )
}

export function Game(): ReactElement {
  const [p1, setP1] = useState<IPlayer>({
    id: 'left',
    name: 'Player1',
    wins: 3,
    losses: 7,
    ready: false
  })
  const [p2, setP2] = useState<IPlayer>({
    id: 'right',
    name: 'Player2',
    wins: 13,
    losses: 17,
    ready: false
  })
  const [playerList, setPlayerList] =
    useState<Map<string, IPaddle>>(clientPlayersPaddle)

  useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent): void => {
      keydown = e.code
    }
    const handleOnKeyUp = (): void => {
      keydown = ''
    }
    window.addEventListener('keydown', handleOnKeyDown)
    window.addEventListener('keyup', handleOnKeyUp)

    socket.emit('updateConnections')
  }, [])

  socket.on(
    'updateConnections',
    (serverPlayersProfile: Map<string, IPlayer>) => {
      // とりあえずreadyだけ
      clientPlayersProfile = new Map(Object.entries(serverPlayersProfile))
      const p1Profile = clientPlayersProfile.get(leftID)
      const p2Profile = clientPlayersProfile.get(rightID)
      if (p1Profile !== undefined) setP1({ ...p1, ready: p1Profile.ready })
      if (p2Profile !== undefined) setP2({ ...p2, ready: p2Profile.ready })
    }
  )

  return playerList === undefined ? (
    <Matching setPlayerList={setPlayerList} />
  ) : (
    <Container>
      <Row id="header">
        <Player player={p1} setPlayer={setP1} />
        <Player player={p2} setPlayer={setP2} />
      </Row>
      <Row>
        <Match p1={p1} p2={p2} />
      </Row>
    </Container>
  )
}

// 接続時
socket.on('connect', () => {
  selfID = socket.id
})

socket.on('updateBall', (serverBall: IBall) => {
  clientBall = serverBall
})

socket.on('updatePaddle', (playerPaddle: Map<string, IPaddle>) => {
  const mapPlayerPaddle = new Map(Object.entries(playerPaddle))
  if (clientPlayersPaddle === undefined) {
    // paddleの初期化
    clientPlayersPaddle = mapPlayerPaddle
    clientPlayersPaddle.forEach((value, key) => {
      if (value.id === 'left') {
        leftID = key
      } else if (value.id === 'right') {
        rightID = key
      }
    })
  } else {
    // new Mapで新しい参照にしないと、useStateが更新されないため
    clientPlayersPaddle = new Map(clientPlayersPaddle)
    mapPlayerPaddle.forEach((value: IPaddle, key: string) => {
      const playerPaddle = clientPlayersPaddle.get(key)
      if (playerPaddle !== undefined) {
        if (key !== selfID) {
          playerPaddle.pos = value.pos
        }
        playerPaddle.score = value.score
      }
    })
  }
})

socket.on('updateCountDown', (seconds: number) => {
  console.log(`updateCountDown: ${seconds}`)
  gtimer = seconds
})
