import React, { type ReactElement, useState } from 'react'
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

const wid: number = 800
const hght: number = 500
const ballPx: number = 20
const initBall: ball = {
  pos: { x: (wid / 2) - (ballPx / 2), y: hght / 2 },
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
  if (pBall.pos.y >= hght - ballPx && pBall.vel.y > 0) {
    pBall.vel.y *= -1
  }
  if (pBall.pos.x <= 0 && pBall.vel.x < 0) {
    pBall.vel.x *= -1
  }
  if (pBall.pos.x >= wid - ballPx && pBall.vel.x > 0) {
    pBall.vel.x *= -1
  }
  return pBall
}

function Game(): ReactElement {
  const [_ticks, setTicks] = useState<number>(0)
  const [pBall, setPBall] = useState<ball>(initBall)
  const [speed, _setSpeed] = useState<number>(1)
  const [p1Score, _setP1Score] = useState<number>(0)
  const [p2Score, _setP2Score] = useState<number>(0)


  // そのcallbackはupdateGame()のような関数です
  useAnimationFrame((time: number, deltaTime: number) => {
    const newBall = updateBall(pBall, deltaTime, speed)
    setPBall(newBall)
    setTicks(time)
  })

  return (
    <div id="game">
      <div id="leftScore">{p1Score}</div>
      <div id="rightScore">{p2Score}</div>
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
