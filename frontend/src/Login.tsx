import React from 'react';
import axios from 'axios';
export function Login() {
    return (
        <div className="Login">
            <button onClick={req}>Log in</button>
        </div>
    );
}

async function req() {
    const res = await axios.get('http://localhost:3001/api')
    console.log(res.data)
}