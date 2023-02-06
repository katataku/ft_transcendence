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

function amplifyTilt(
  absValFromPaddle: number,
  relativePosBall: number
): number {
  let x = 0
  /*
    absValue >= 0.n
    nの最大値の求め方
    n = (paddleSize.y / 2 + ballPx / 2) / 10
  */
  if (absValFromPaddle >= 0.5) {
    x = 1.5
  } else if (absValFromPaddle >= 0.4) {
    x = 2
  } else if (absValFromPaddle >= 0.3) {
    x = 3
  } else if (absValFromPaddle >= 0.2) {
    x = 4
  } else if (absValFromPaddle >= 0.1) {
    x = 5
  }
  return x === 0 ? 0 : relativePosBall / x
}

function handlePaddleCollision(pBall: IBall, paddle: IPaddle): void {
  const relativePosBall =
    (pBall.pos.y + ballPx / 2 - (paddle.pos.y + paddleSize.y / 2)) / 100
  const absValFromPaddle = Math.abs(relativePosBall)
  /*
    relativePosBallはpaddle.yが100pxであるから機能している。
    pBall.vel.y = relativePosBall
    ではボールの傾きが小さいので傾きを大きくするために足している。
  */
  pBall.vel.y = relativePosBall + amplifyTilt(absValFromPaddle, relativePosBall)
  /*
    yの速度が速くなるほどxの速度を遅くしなければ、直線の軌道が遅く見えてしまう
    n = 2.3 パドルの端に当たった時のボールのxの速度を決める変数
    nを大きくすればxの速度は速くなる
    nを小さくすればxの速度は遅くなる
  */
  const n = 2.3
  pBall.vel.x =
    pBall.vel.x < 0 ? 1 - absValFromPaddle / n : absValFromPaddle / n - 1
}

function updateBall(
  pBall: IBall,
  deltaTime: number,
  speed: number,
  leftPaddle: IPaddle,
  rightPaddle: IPaddle,
  handleScoreChange: () => void
): IBall {
  pBall.pos.x += pBall.vel.x * deltaTime * speed
  pBall.pos.y += pBall.vel.y * deltaTime * speed
  if (pBall.pos.y <= 0 && pBall.vel.y < 0) {
    pBall.vel.y *= -1
  } else if (pBall.pos.y >= gameWinHght - ballPx && pBall.vel.y > 0) {
    pBall.vel.y *= -1
  } else if (
    // goal hit
    (pBall.pos.x <= 0 && pBall.vel.x < 0) ||
    (pBall.pos.x >= gameWinWid - ballPx && pBall.vel.x > 0)
  ) {
    pBall.pos = deepCpInitBall().pos
    pBall.vel = deepCpInitBall().vel
    pBall.vel.x *= -1
    handleScoreChange()
  } else if (
    // left paddle hit
    pBall.vel.x < 0 &&
    leftPaddle.pos.x <= pBall.pos.x + ballPx &&
    pBall.pos.x <= leftPaddle.pos.x + paddleSize.x &&
    leftPaddle.pos.y <= pBall.pos.y + ballPx &&
    pBall.pos.y <= leftPaddle.pos.y + paddleSize.y
  ) {
    handlePaddleCollision(pBall, leftPaddle)
  } else if (
    pBall.vel.x > 0 &&
    rightPaddle.pos.x <= pBall.pos.x + ballPx &&
    pBall.pos.x <= rightPaddle.pos.x + paddleSize.x &&
    rightPaddle.pos.y <= pBall.pos.y + ballPx &&
    pBall.pos.y <= rightPaddle.pos.y + paddleSize.y
  ) {
    handlePaddleCollision(pBall, rightPaddle)
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

function Game(props: { handleScoreChange: () => void }): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [pBall, setPBall] = useState<IBall>(deepCpInitBall())
  const p1Score = useRef<number>(0)
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(initLeftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(initRightPaddle)
  const p2Score = useRef<number>(0)
  const speed = useRef<number>(300)

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
      props.handleScoreChange
    )
    setLeftPaddle(newLeftPaddle)
    setRightPaddle(newRightPaddle)
    setPBall(newBall)
    setLeftPaddle(newLeftPaddle)
    setRightPaddle(newRightPaddle)
    setTicks(time)
  })

  const modifySpeed = (e: ChangeEvent<HTMLSelectElement>): void => {
    console.log(typeof e.target.value)
    switch (e.target.value) {
      case 'easy':
        speed.current = 300
        break
      case 'medium':
        speed.current = 500
        break
      case 'hard':
        speed.current = 800
        break
    }
  }

  return (
    <div id="game">
      <div id="leftScore">{p1Score.current}</div>
      <div id="rightScore">{p2Score.current}</div>
      <div id="powerup">
        <label htmlFor="powerup">Speed:</label>
        <select onChange={modifySpeed} name="speed" id="powerup">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div id="gameDiv"></div>
      <Ball pBall={pBall} />
      <Paddle paddle={leftPaddle} />
      <Paddle paddle={rightPaddle} />
    </div>
  )
}

export function Match(): ReactElement {
  const [score, setScore] = useState<number>(0)
  const handleScoreChange = (): void => {
    setScore((score) => {
      return score + 1
    })
  }

  useEffect(() => {
    if (score === 10) {
      console.log('GAME SET')
    }
  }, [score])

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
      <div id="score">
        <p>score: {score}</p>
      </div>
      <Game handleScoreChange={handleScoreChange} />
    </div>
  )
}

function req(): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
