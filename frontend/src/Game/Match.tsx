import React, {
  type ReactElement,
  type ChangeEvent,
  useState,
  useRef,
  useEffect
} from 'react'
import { useAnimationFrame } from '../utils'
import './Match.css'
// import axios from 'axios'

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
  leftScore: number
  rightScore: number
}

type UPlayer = 'left' | 'right'

const gameWinWid: number = 800
const gameWinHght: number = 500
const ballPx: number = 20
const paddleSize: Vector2 = {
  x: 8,
  y: 100
}
const paddleSpeed: number = 10
const initBall: IBall = {
  pos: { x: gameWinWid / 2 - ballPx / 2, y: gameWinHght / 2 },
  vel: { x: -233, y: 235 }
}
const initLeftPaddle: IPaddle = {
  pos: { x: gameWinWid / 20, y: gameWinHght / 2 - paddleSize.y / 2 }
}
const initRightPaddle: IPaddle = {
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2
  }
}
const deepCpInitBall = (): IBall => {
  return JSON.parse(JSON.stringify(initBall)) // deep copy of Object
}
const winningScore = 3

let keydown = ''

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

function Ball(props: { pBall: IBall }): ReactElement {
  return (
    <div
      style={{
        width: `${ballPx}px`,
        height: `${ballPx}px`,
        top: `${props.pBall.pos.y}px`,
        left: `${props.pBall.pos.x}px`,
        position: 'absolute',
        backgroundColor: 'white'
      }}
      id="ball"
    />
  )
}

function updateBall(
  pBall: IBall,
  deltaTime: number,
  speed: number,
  leftPaddle: IPaddle,
  rightPaddle: IPaddle,
  updateScore: (player: UPlayer) => void
): IBall {
  pBall.pos.x += pBall.vel.x * deltaTime * speed
  pBall.pos.y += pBall.vel.y * deltaTime * speed
  if (pBall.pos.y <= 0 && pBall.vel.y < 0) {
    pBall.vel.y *= -1
  } else if (pBall.pos.y >= gameWinHght - ballPx && pBall.vel.y > 0) {
    pBall.vel.y *= -1
  } else if (
    // goal hit
    pBall.pos.x <= 0 ||
    pBall.pos.x >= gameWinWid - ballPx
  ) {
    if (pBall.vel.x < 0) {
      updateScore('right')
    } else {
      updateScore('left')
    }
    pBall.pos = deepCpInitBall().pos
    pBall.vel.x *= -1
  } else if (
    // paddle hit
    (pBall.vel.x < 0 &&
      leftPaddle.pos.x <= pBall.pos.x + ballPx &&
      pBall.pos.x <= leftPaddle.pos.x + paddleSize.x &&
      leftPaddle.pos.y <= pBall.pos.y + ballPx &&
      pBall.pos.y <= leftPaddle.pos.y + paddleSize.y) ||
    (pBall.vel.x > 0 &&
      rightPaddle.pos.x <= pBall.pos.x + ballPx &&
      pBall.pos.x <= rightPaddle.pos.x + paddleSize.x &&
      rightPaddle.pos.y <= pBall.pos.y + ballPx &&
      pBall.pos.y <= rightPaddle.pos.y + paddleSize.y)
  ) {
    pBall.vel.x *= -1
  }
  return pBall
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

function renderResult(isLeftWinner: boolean): ReactElement {
  const winner = isLeftWinner ? 'left' : 'right'
  return <div id={`${winner}Result`}>WIN</div>
}

function Game(): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [pBall, setPBall] = useState<IBall>(deepCpInitBall())
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(initLeftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(initRightPaddle)
  const score = useRef<IScore>({ leftScore: 0, rightScore: 0 })
  const speed = useRef<number>(1)
  const updateScore = useRef<(player: UPlayer) => void>((player) => {
    if (player === 'left') {
      score.current.leftScore++
    } else if (player === 'right') {
      score.current.rightScore++
    }
  })

  const isGameSet = !(
    score.current.leftScore < winningScore &&
    score.current.rightScore < winningScore
  )

  //   そのcallbackはupdateGame()のような関数です
  useAnimationFrame((time: number, deltaTime: number) => {
    const newLeftPaddle = updatePaddle(leftPaddle)
    const newRightPaddle = updatePaddle(rightPaddle)
    const newBall = updateBall(
      pBall,
      deltaTime,
      speed.current,
      newLeftPaddle,
      newRightPaddle,
      updateScore.current
    )
    setLeftPaddle(newLeftPaddle)
    setRightPaddle(newRightPaddle)
    setPBall(newBall)
    setTicks(time)
  }, isGameSet)

  const modifySpeed = (e: ChangeEvent<HTMLSelectElement>): void => {
    console.log(typeof e.target.value)
    switch (e.target.value) {
      case 'easy':
        speed.current = 1
        break
      case 'medium':
        speed.current = 2
        break
      case 'hard':
        speed.current = 3
        break
    }
  }

  return (
    <div id="game">
      <div id="gameDiv"></div>
      <div id="leftScore">{score.current.leftScore}</div>
      <div id="rightScore">{score.current.rightScore}</div>
      <div id="powerup">
        <label htmlFor="powerup">Speed:</label>
        <select onChange={modifySpeed} name="speed" id="powerup">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {/* <div id="gameDiv"></div> */}
      {isGameSet ? (
        renderResult(score.current.leftScore > score.current.rightScore)
      ) : (
        <Ball pBall={pBall} />
      )}
      <Paddle paddle={leftPaddle} />
      <Paddle paddle={rightPaddle} />
    </div>
  )
}

export function Match(): ReactElement {
  useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent): void => {
      keydown = e.code
    }
    const handleOnKeyUp = (): void => {
      keydown = ''
    }
    window.addEventListener('keydown', handleOnKeyDown)
    window.addEventListener('keyup', handleOnKeyUp)
  }, [])

  return (
    <div id="page">
      <div id="header">
        <button onClick={req}>click</button>
      </div>
      <Game />
    </div>
  )
}

function req(): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
