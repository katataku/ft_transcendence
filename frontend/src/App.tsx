import React from 'react';
import axios from 'axios';

export function App() {
  return (
    <div className="App">
    <button onClick={req}>req</button>
      React
    </div>
  );
}

async function req() {
  const res = await axios.get('http://localhost:3001/api')
  console.log(res.data)
}
