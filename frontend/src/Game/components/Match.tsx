import React, {
  type ReactElement,
  type ChangeEvent,
  useState,
  useRef,
  useEffect
} from 'react'

import {
  type Vector2,
  type IBall,
  type IPaddle,
  type IScore,
  type UPlayer
} from '../types/Game'

import { useAnimationFrame } from '../../hooks/useAnimationFrame'
import '../assets/styles.css'
// import axios from 'axios'

const gameWinWid: number = 800
const gameWinHght: number = 500
const ballPx: number = 20
const paddleSize: Vector2 = {
  x: 8,
  y: 100
}
const paddleSpeed: number = 10
const initBall: IBall = {
  pos: { x: gameWinWid / 2 - ballPx / 2, y: gameWinHght / 2 - ballPx / 2 },
  vel: { x: -1, y: 0.5 }
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

function calculateTilt(relativePosBall: number): number {
  const absValFromPaddle = Math.abs(relativePosBall)
  let x = 0
  /*
    paddleの半分から80%だったら
    paddleの半分から60%だったら...
    xは大きくなれば傾きも大きくなる
  */
  if (absValFromPaddle >= 0.9) {
    x = 0.8
  } else if (absValFromPaddle >= 0.8) {
    x = 0.6
  } else if (absValFromPaddle >= 0.6) {
    x = 0.4
  } else if (absValFromPaddle >= 0.4) {
    x = 0.3
  } else if (absValFromPaddle >= 0.2) {
    x = 0.2
  } else {
    x = absValFromPaddle
  }
  return relativePosBall < 0 ? -x : x
}

function handlePaddleCollision(ball: IBall, paddle: IPaddle): void {
  const compositeVelocity = Math.sqrt(ball.vel.x ** 2 + ball.vel.y ** 2)
  ball.vel.y = calculateTilt(
    // ボールがパドルの何%で衝突したのか)
    (ball.pos.y + ballPx / 2 - (paddle.pos.y + paddleSize.y / 2)) /
      (paddleSize.y / 2)
  )
  ball.vel.x =
    ball.vel.x < 0
      ? Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2)
      : -Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2)
}

function isHitPaddle(ball: IBall, paddle: IPaddle): boolean {
  return (
    paddle.pos.x <= ball.pos.x + ballPx &&
    ball.pos.x <= paddle.pos.x + paddleSize.x &&
    paddle.pos.y <= ball.pos.y + ballPx &&
    ball.pos.y <= paddle.pos.y + paddleSize.y
  )
}

function updateBall(
  ball: IBall,
  deltaTime: number,
  speed: number,
  leftPaddle: IPaddle,
  rightPaddle: IPaddle,
  incrementScore: (player: UPlayer) => void
): IBall {
  ball.pos.x += ball.vel.x * deltaTime * speed
  ball.pos.y += ball.vel.y * deltaTime * speed
  if (ball.pos.y <= 0 && ball.vel.y < 0) {
    ball.vel.y *= -1
  } else if (ball.pos.y >= gameWinHght - ballPx && ball.vel.y > 0) {
    ball.vel.y *= -1
  } else if (
    // goal hit
    ball.pos.x <= 0 ||
    ball.pos.x >= gameWinWid - ballPx
  ) {
    if (ball.vel.x < 0) {
      incrementScore('right')
    } else {
      incrementScore('left')
    }
    ball.pos = deepCpInitBall().pos
    ball.vel = deepCpInitBall().vel
    ball.vel.x *= -1
  } else if (
    // left paddle hit
    ball.vel.x < 0 &&
    isHitPaddle(ball, leftPaddle)
  ) {
    handlePaddleCollision(ball, leftPaddle)
  } else if (
    // right paddle hit
    ball.vel.x > 0 &&
    isHitPaddle(ball, rightPaddle)
  ) {
    handlePaddleCollision(ball, rightPaddle)
  }
  return ball
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

function Result(props: { isLeftWinner: boolean }): ReactElement {
  const winner = props.isLeftWinner ? 'left' : 'right'
  return <div id={`${winner}Result`}>WIN</div>
}

function Game(): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [ball, setBall] = useState<IBall>(deepCpInitBall())
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(initLeftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(initRightPaddle)
  const score = useRef<IScore>({ leftScore: 0, rightScore: 0 })
  const speed = useRef<number>(400)
  const incrementScore = useRef<(player: UPlayer) => void>((player) => {
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
      ball,
      deltaTime,
      speed.current,
      newLeftPaddle,
      newRightPaddle,
      incrementScore.current
    )
    setLeftPaddle(newLeftPaddle)
    setRightPaddle(newRightPaddle)
    setBall(newBall)
    setTicks(time)
  }, isGameSet)

  const modifySpeed = (e: ChangeEvent<HTMLSelectElement>): void => {
    console.log(typeof e.target.value)
    switch (e.target.value) {
      case 'easy':
        speed.current = 400
        break
      case 'medium':
        speed.current = 600
        break
      case 'hard':
        speed.current = 800
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
      {isGameSet ? (
        <Result
          isLeftWinner={score.current.leftScore > score.current.rightScore}
        />
      ) : (
        <Ball ball={ball} />
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
