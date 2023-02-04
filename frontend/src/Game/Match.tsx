import React, {type ReactElement, type ChangeEvent, useState, useRef, useEffect} from 'react'
import { useAnimationFrame } from '../utils'
import './Match.css'
// import axios from 'axios'

interface Vector2 {
  x: number
  y: number
}

interface ball {
  pos: Vector2
  vel: Vector2
}

interface _paddle {
  pos: Vector2
  dir: number
}

const gameWinWid: number = 800
const gameWinHght: number = 500
const ballPx: number = 20
const initBall: ball = {
  pos: { x: (gameWinWid / 2) - (ballPx / 2), y: gameWinHght / 2 },
  vel: { x: -233, y: 235 }
}

function Ball(props: { pBall: ball }): ReactElement {
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

function updateBall(pBall: ball, deltaTime: number, speed: number): ball {
  pBall.pos.x += pBall.vel.x * deltaTime * speed
  pBall.pos.y += pBall.vel.y * deltaTime * speed
  if (pBall.pos.y <= 0 && pBall.vel.y < 0) {
    pBall.vel.y *= -1
  }
  if (pBall.pos.y >= gameWinHght - ballPx && pBall.vel.y > 0) {
    pBall.vel.y *= -1
  }
  if (pBall.pos.x <= 0 && pBall.vel.x < 0) {
    pBall.vel.x *= -1
  }
  if (pBall.pos.x >= gameWinWid - ballPx && pBall.vel.x > 0) {
    pBall.vel.x *= -1
  }
  return pBall
}

function Game(): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [pBall, setPBall] = useState<ball>(initBall)
  const p1Score = useRef<number>(0)
  const p2Score = useRef<number>(0)
  const speed = useRef<number>(1)


  // そのcallbackはupdateGame()のような関数です
  useAnimationFrame((time: number, deltaTime: number) => {
    const newBall = updateBall(pBall, deltaTime, speed.current)
    setPBall(newBall)
    setTicks(time)
  })

  const modifySpeed = (e: ChangeEvent<HTMLSelectElement>): void => {
    console.log(typeof e.target.value)
    switch (e.target.value) {
      case("easy"):
        speed.current = 1
        break
      case("medium"):
        speed.current = 2
        break
      case("hard"):
        speed.current = 3
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
    </div>
  )
}

export function Match(): ReactElement {
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
