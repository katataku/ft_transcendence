import React, { type ReactElement } from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'

export function App(): ReactElement {
  const ChatListState: ChatListState = { kicked: false }
  return (
    <div className="App">
      <button onClick={req}>req</button>
      React
      <p>
        <Link to="chatlist" state={{ ChatListState }}>
          Move to ChatList
        </Link>
      </p>
      <p>
        <Link to="Game">Move to Game</Link>
      </p>
      <p>
        <Link to="Login">Move to Login</Link>
      </p>
    </div>
  )
}

function req(): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
