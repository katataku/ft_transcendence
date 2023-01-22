import React from 'react';
import axios from 'axios';
export function Match() {
    return (
        <div className="Match">
            <button onClick={req}>MATCH</button>
            React
        </div>
    );
}

async function req() {
    const res = await axios.get('http://localhost:3001/match')
    console.log(res.data)
}