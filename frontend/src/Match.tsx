import React, { useState, useEffect, useRef } from 'react';
import './css/Match.css'
import axios from 'axios';

type Vector2 = {
    x: number,
    y: number,
}

interface ball {
    pos: Vector2,
    vel: Vector2,
}

interface paddle {
    pos: Vector2,
    dir: number,
}

const wid: number = 800;
const hght: number = 500;
const ballSz: number = 20;
const initBall: ball = {
    pos: {x: wid/2, y: hght/2},
    vel: {x: -233.021462477158, y: 235}
};



function Ball(props: {pBall: ball}) {
    return (
        <div
            style={{
                width: `${ballSz}px`,
                height: `${ballSz}px`,
                top: `${props.pBall.pos.y}px`,
                left: `${props.pBall.pos.x}px`,
                position: "absolute",
                backgroundColor: "white"
            }}
            id="ball"
        />
   );
}

function updateBall(pBall: ball, deltaTime: number, speed: number) {
    pBall.pos.x += pBall.vel.x * deltaTime * speed;
    pBall.pos.y += pBall.vel.y * deltaTime * speed;
    if (pBall.pos.y <= 0 && pBall.vel.y < 0) {
        pBall.vel.y *= -1;
    }
    if (pBall.pos.y >= hght - ballSz && pBall.vel.y > 0) {
        pBall.vel.y *= -1;
    }
    if (pBall.pos.x <= 0 && pBall.vel.x < 0) {
        pBall.vel.x *= -1;
    }
    if (pBall.pos.x >= wid - ballSz && pBall.vel.x > 0) {
        pBall.vel.x *= -1;
    }
    return pBall;
}
const useAnimationFrame = (callback: Function) => {
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(performance.now());

    const animate = (time: number) => {
        if (time !== previousTimeRef.current) {
            const deltaTime = (time - previousTimeRef.current) / 1000;
            callback(time, deltaTime)
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}

function Game() {
    const [ticks, setTicks] = useState<number>(0);
    const [pBall, setPBall] = useState<ball>(initBall);
    const [speed, setSpeed] = useState<number>(2);

    useAnimationFrame((time: number, deltaTime: number) => {
        setPBall(updateBall(pBall, deltaTime, speed));
        setTicks(time)
    })

    return (
        <div id="game">
            <Ball pBall={pBall} />
        </div>
    );
}

export function Match() {
    return (
        <div id="page">
            <div id="header">
                <button onClick={req}>click</button>
            </div>
            <Game/>
        </div>
    );
}

async function req() {
    const res = await axios.get('http://localhost:3001/api')
    console.log(res.data)
}
