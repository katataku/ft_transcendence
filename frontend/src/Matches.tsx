import React from 'react';
import './css/Matches.css'
import axios from 'axios';

export function Matches() {
    return (
        <div id="page">
            <div id="header">
                <button onClick={req}>click</button>
            </div>
            <div id="game">
                {/*<div id="ball"></div>*/}
            </div>
        </div>
    );
}

async function req() {
    const res = await axios.get('http://localhost:3001/api')
    console.log(res.data)
}
