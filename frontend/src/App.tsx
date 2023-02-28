import { type ReactElement, useState, useEffect } from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { Resistration } from './User/Resistration'

export function App(): ReactElement {
  const ChatListState: ChatListState = { kicked: false }
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User>({
    id: 0,
    name: 'hoge'
  })

  useEffect(() => {
    console.log(user)
  }, [loggedIn])

  // プロフィル/チャット->ゲーム をナビゲートされる人のユーザー情報は必要があります
  // 下の<Link to="Game" state={user}>のようでできます
  if (loggedIn) {
    return (
      <div className="App">
        <p>ID : {user.id}</p>
        <p>NAME: {user.name}</p>
        <p>
          <Link to="chatlist" state={{ ChatListState }}>
            Move to ChatList
          </Link>
        </p>
        <p>
          <Link to="MatchList">Move to MatchList</Link>
        </p>
        <p>
          <Link
            to="Game"
            state={{ matchId: 0, userId: user.id, userName: user.name }}
          >
            Move to Game
          </Link>
        </p>
        <p>
          <Button
            onClick={() => {
              setLoggedIn(false)
            }}
          >
            Log out
          </Button>
        </p>
      </div>
    )
  } else {
    return (
      <Resistration user={user} setUser={setUser} setLoggedIn={setLoggedIn} />
    )
  }
}
