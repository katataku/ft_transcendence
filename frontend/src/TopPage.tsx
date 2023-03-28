import { type ReactElement, useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { SignIn } from './User/components/SignIn'
import { GlobalContext } from './App'
import { initUser, localStorageKey } from './constants'

export function TopPage(): ReactElement {
  const { loginUser, setLoginUser } = useContext(GlobalContext)

  // マッチリスト・プロフィル・チャット->ゲームに行くとmatchIdは必要があります。
  // プロフィル・チャット->ゲームに行くとまだmatchId決めていないので
  // 下の<Link to="Game" state={0}>のようで書けます
  return (
    <div className="App">
      {loginUser.id !== 0 ? (
        <div>
          <p>
            <Link data-cy="link-to-chatlist" to="chatlist">
              Move to ChatList
            </Link>
          </p>
          <p>
            <Link data-cy="link-to-matchlist" to="MatchList">Move to MatchList</Link>
          </p>
          <p>
            <Link data-cy="link-to-gamepage" to="Game" state={0}>
              Move to Game
            </Link>
          </p>
          <p>
            <Link to={'profile/' + String(loginUser.id)}>
              Move to My page (My Profile)
            </Link>
          </p>
          <p>
            <Link to={'profile/' + String(1)}>Move to Guest1 Profile</Link>
          </p>
          <p>
            <Link to={'profile/' + String(2)}>Move to Guest2 Profile</Link>
          </p>
          <p>
            <Button
              onClick={() => {
                localStorage.removeItem(localStorageKey)
                setLoginUser(initUser)
              }}
            >
              Sign out
            </Button>
          </p>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  )
}
