import React, {type ReactElement, useState} from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export function App(): ReactElement {
  const ChatListState: ChatListState = { kicked: false }
  const [user, setUser] = useState<IPlayer>({
    id: 1,
    name: '',
    wins: 3,
    losses: 7,
    ready: false
  })

  return (
    <div className="App">
      <button onClick={req}>req</button>
      React
        <Form.Control
          placeholder="UserName"
          onChange={(e) => {
            setUser({...user, name: e.target.value})
          }}
        />
        <Button
          onClick={() => {
            setUser({...user, name: user.name})
          }}>
          Submit
        </Button>
      <p>
        <Link to="chatlist" state={{ ChatListState }}>
          Move to ChatList
        </Link>
      </p>
      <p>
        <Link to="MatchList" state={user}>Move to MatchList</Link>
      </p>
      <p>
        <Link to="Game" state={user}>Move to Game</Link>
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
