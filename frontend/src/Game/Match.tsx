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

const gameWinWid: number = 1000
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
    pBall.vel.x *= -1
    handleScoreChange()
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

function Game(props: { handleScoreChange: () => void }): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [pBall, setPBall] = useState<IBall>(deepCpInitBall())
  const p1Score = useRef<number>(0)
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(initLeftPaddle)
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(initRightPaddle)
  const p2Score = useRef<number>(0)
  const speed = useRef<number>(1)

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
    setTicks(time)
  })

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
      <div id="powerup">
        <label htmlFor="powerup">Speed:</label>
        <select onChange={modifySpeed} name="speed" id="powerup">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div id="match">
        <div id="leftScore">{p1Score.current}</div>
        <div id="rightScore">{p2Score.current}</div>
        <div id="gameDiv"></div>
        <Ball pBall={pBall} />
        <Paddle paddle={leftPaddle} />
        <Paddle paddle={rightPaddle} />
      </div>
    </div>
  )
}

export function Match(): ReactElement {
  const [score, setScore] = useState<number>(0)
  const handleScoreChange = (): void => {
    setScore((score) => {
      console.log(score + 1)
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
      <div className="row" id="header">
        <div className="column" id="p1">Player 1</div>
        <div className="column" id="p2">Player 2</div>
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
