import React, { useState, useEffect, useRef } from 'react';
import './css/Matches.css'
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

const wid = 800;
const hght = 500;

const GameLoop = (updateGame: Function) => {
    const requestID = useRef<number>();
    const previousTime = useRef<number>();


    // called after browser renders
    // time = the time when our callback function (updateGame) is called by the browser
    const loop = (time: DOMHighResTimeStamp) => {


        if (previousTime.current !== undefined) {
            const deltaTime = (time - previousTime.current) / 1000;
            updateGame(time, deltaTime);
        }
        previousTime.current = time;
        requestID.current = requestAnimationFrame(loop);

    }

    // called after react renders (after react updates the DOM)
    useEffect(()=>{
        console.log('use effect')
        requestID.current = requestAnimationFrame(loop);

        /*const num: number = requestID.current;
        if (num !== undefined) {
            return()=> cancelAnimationFrame(num);
        }*/
    }, [])

}
function Ball(props: {pBall: ball}) {

    return (
        <div
            style={{
                width: "20px",
                height: "20px",
                top: `${props.pBall.pos.y}px`,
                left: `${props.pBall.pos.x}px`,
                position: "absolute",
                backgroundColor: "white"
            }}
            id="ball"
        />
   );
}

function Game() {
    const [time, setTime] = useState<number>(0);
    const [deltaTime, setDeltaTime] = useState<number>(0);
    const [pBall, setPBall] = useState<ball>({pos: {x: wid/2, y: hght/2}, vel: {x: -233.021462477158, y: 235}})


    GameLoop((time: number, deltaTime: number)=>{

        setTime(time);
        setDeltaTime(deltaTime);
        const tBall: ball = pBall;
        tBall.pos.x += tBall.vel.x * deltaTime;
        tBall.pos.y += tBall.vel.y * deltaTime;
        if (tBall.pos.y <= 0 && tBall.vel.y < 0) {
            tBall.vel.y *= -1;
        }
        if (tBall.pos.y >= hght - 20 && tBall.vel.y > 0) {
            tBall.vel.y *= -1;
        }
        if (tBall.pos.x <= 0 && tBall.vel.x < 0) {
            tBall.vel.x *= -1;
        }
        if (tBall.pos.x >= wid - 20 && tBall.vel.x > 0) {
            tBall.vel.x *= -1;
        }
        setPBall(tBall);
    });

    return (
        <div id="game">
            <Ball pBall={pBall}/>
        </div>
    );
}

export function Matches() {
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
