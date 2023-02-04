/* eslint-disable */
import React, { type ReactElement, useState, useEffect } from 'react';
import { useAnimationFrame } from '../utils';
import './Match.css';
// import axios from 'axios'

interface Vector2 {
  x: number;
  y: number;
}

interface IBall {
  pos: Vector2;
  vel: Vector2;
}

interface IPaddle {
  pos: Vector2;
}

const wid: number = 800;
const hght: number = 500;
const ballPx: number = 20;
const paddleSize: Vector2 = {
  x: 8,
  y: 100,
};
const paddleSpeed: number = 10;
const initBall: IBall = {
  pos: { x: wid / 2, y: hght / 2 },
  vel: { x: -233, y: 235 },
};
const initPaddle: IPaddle = {
  pos: { x: wid / 20, y: hght / 2 - paddleSize.y / 2 },
};
const deepCpInitBall = () => {
  return JSON.parse(JSON.stringify(initBall)); // deep copy
};

let keydown = '';

function Paddle(props: { paddle: IPaddle }) {
  return (
    <div
      style={{
        backgroundColor: 'red',
        width: `${paddleSize.x}px`,
        height: `${paddleSize.y}px`,
        position: 'absolute',
        top: `${props.paddle.pos.y}px`,
        left: `${props.paddle.pos.x}px`,
      }}
      id="paddle"
    />
  );
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
        backgroundColor: 'blue',
      }}
      id="ball"
    />
  );
}

function updateBall(
  pBall: IBall,
  deltaTime: number,
  speed: number,
  paddle: IPaddle,
  handleScoreChange: Function,
): IBall {
  pBall.pos.x += pBall.vel.x * deltaTime * speed;
  pBall.pos.y += pBall.vel.y * deltaTime * speed;
  if (pBall.pos.y <= 0 && pBall.vel.y < 0) {
    pBall.vel.y *= -1;
  } else if (pBall.pos.y >= hght - ballPx && pBall.vel.y > 0) {
    pBall.vel.y *= -1;
  } else if (
    // goal hit
    (pBall.pos.x <= 0 && pBall.vel.x < 0) ||
    (pBall.pos.x >= wid - ballPx && pBall.vel.x > 0)
  ) {
    pBall.pos = deepCpInitBall().pos;
    pBall.vel.x *= -1;
    handleScoreChange();
  } else if (
    // paddle hit
    paddle.pos.x <= pBall.pos.x + ballPx &&
    pBall.pos.x <= paddle.pos.x + paddleSize.x &&
    paddle.pos.y <= pBall.pos.y + ballPx &&
    pBall.pos.y <= paddle.pos.y + paddleSize.y
  ) {
    pBall.vel.x *= -1;
  }
  return pBall;
}
function updatePaddle(paddle: IPaddle) {
  switch (keydown) {
    case 'ArrowUp':
      if (paddle.pos.y >= paddleSpeed) paddle.pos.y += -paddleSpeed;
      break;
    case 'ArrowDown':
      if (paddle.pos.y <= hght - paddleSize.y - paddleSpeed)
        paddle.pos.y += paddleSpeed;
      break;
    default:
      break;
  }
  return paddle;
}

function Game(props: { handleScoreChange: Function }): ReactElement {
  const [ticks, setTicks] = useState<number>(0);
  const [pBall, setPBall] = useState<IBall>(deepCpInitBall());
  const [speed, setSpeed] = useState<number>(1);
  const [paddle, setPaddle] = useState<IPaddle>(initPaddle);

  //   そのcallbackはupdateGame()のような関数です
  useAnimationFrame((time: number, deltaTime: number) => {
    const newBall = updateBall(
      pBall,
      deltaTime,
      speed,
      paddle,
      props.handleScoreChange,
    );
    const newPaddle = updatePaddle(paddle);
    setPBall(newBall);
    setPaddle(newPaddle);
    setTicks(time);
    console.log(paddle.pos.y);
  });

  return (
    <div id="game">
      <Ball pBall={pBall} />
      <Paddle paddle={paddle} />
    </div>
  );
}

export function Match(): ReactElement {
  const [score, setScore] = useState<number>(0);
  const handleScoreChange = () => {
    setScore((score) => {
      console.log(score + 1);
      return score + 1;
    });
  };

  useEffect(() => {
    if (score === 10) {
      console.log('GAME SET');
    }
  }, [score]);

  const handleOnKeyDonw = (e: KeyboardEvent) => {
    keydown = e.code;
  };

  const handleOnKeyUp = (e: KeyboardEvent) => {
    keydown = '';
  };

  window.addEventListener('keydown', handleOnKeyDonw);
  window.addEventListener('keyup', handleOnKeyUp);
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
  );
}

function req(): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
