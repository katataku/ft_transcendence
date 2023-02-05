import React, { type ReactElement } from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'

export function App(): ReactElement {
  return (
    <div className="App">
      <button onClick={req}>req</button>
      React
      <p>
        <Link to="chatlist">Move to ChatList</Link>
      </p>
    </div>
  )
}

function req(): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
