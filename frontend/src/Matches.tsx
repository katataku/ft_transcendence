import React from 'react';
import axios from 'axios';

export function Matches() {
    return (
        <div className="Matches">
            <button onClick={req}>MATCH</button>
        </div>
    );
}

async function req() {
    const res = await axios.get('http://localhost:3001/api')
    console.log(res.data)
}