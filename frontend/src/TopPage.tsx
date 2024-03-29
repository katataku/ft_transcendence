import { type ReactElement, useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { SignIn } from './User/components/SignIn'
import { GlobalContext } from './App'
import { initUser, localStorageKey } from './constants'
import { getAllUsersRequest } from './utils/userAxios'

export function TopPage(): ReactElement {
  const { loginUser, setLoginUser } = useContext(GlobalContext)
  const [allUserList, setALLUserList] = useState<User[]>([])

  useEffect(() => {
    // ログインしていないときはユーザ一覧を取得しない。
    // ログインしていない時はリクエストがエラーとなるため。
    if (loginUser.id !== 0) {
      // ユーザ一覧を取得する。
      getAllUsersRequest((data) => {
        setALLUserList(data)
      })
    }
  }, [loginUser])

  // マッチリスト・プロフィル・チャット->ゲームに行くとmatchIdは必要があります。
  // プロフィル・チャット->ゲームに行くとまだmatchId決めていないので
  // 下の<Link to="Game" state={0}>のようで書けます
  return (
    <div className="App">
      {loginUser.id !== 0 ? (
        <div>
          <p>
            <Link data-cy="link-to-chatlist" to="chatlist">
              チャットルーム一覧
            </Link>
          </p>
          <p>
            <Link data-cy="link-to-matchList" to="MatchList">
              実施中のゲームを観戦
            </Link>
          </p>
          <p>
            <Link data-cy="link-to-gamePage" to="Game" state={0}>
              Pong ゲームを開始
            </Link>
          </p>
          <p>
            <Link to={'profile/' + String(loginUser.id)}>
              My page (My Profile)
            </Link>
          </p>
          {allUserList.map((user) => {
            if (user.id === loginUser.id) return null
            return (
              <p key={user.id}>
                <Link to={'profile/' + String(user.id)}>
                  Profile: {user.name}(user id: {user.id})
                </Link>
              </p>
            )
          })}
          <p>
            <Button
              data-cy="signOut-button"
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
