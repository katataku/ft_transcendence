import { type ReactElement, useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { SignIn } from './User/components/SignIn'
import { GlobalContext } from './App'

export function TopPage(): ReactElement {
  const ChatListState: ChatListState = { kicked: false }
  const { loginUser, isSignedIn, setIsSignedIn } = useContext(GlobalContext)

  // プロフィル/チャット->ゲーム をナビゲートされる人のユーザー情報は必要があります
  // 下の<Link to="Game" state={user}>のようでできます
  return (
    <div className="App">
      {isSignedIn ? (
        <div>
          <p>ID : {loginUser.id}</p>
          <p>NAME: {loginUser.name}</p>
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
              state={{ matchId: 0, userId: loginUser.id, userName: loginUser.name }}
            >
              Move to Game
            </Link>
          </p>
          <p>
            <Button
              onClick={() => {
                setIsSignedIn(false)
              }}
            >
              Log out
            </Button>
          </p>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  )
}
