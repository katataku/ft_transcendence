import {
  type ReactElement,
  useState,
  createContext,
  useEffect,
  useContext
} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Game, MatchList } from './Game'
import { ChatList, Chat, ChatRoom } from './Chat'
import { TopPage } from './TopPage'
import { Header } from './Header'
import { Profile } from './User'
import { Notification } from './Notification'
import { GameSocketContext } from './Game/utils/gameSocketContext'
import { Auth42callback } from './Auth/callback'
import { Private } from './PrivateRoute'
import { validateJwtToken } from './utils/authAxios'
import { initUser } from './constants'

// interfaceの初期化をしろとeslintに怒られますが、Setterは初期化できないため、ここだけeslintを無視します。
export const GlobalContext = createContext<GlobalContext>({} as GlobalContext) // eslint-disable-line

export function App(): ReactElement {
  const [loginUser, setLoginUser] = useState<User>(initUser)
  const [hasResponse, setHasResponse] = useState<boolean>(false)
  const gameSocket = useContext(GameSocketContext)

  const context: GlobalContext = {
    loginUser,
    setLoginUser
  }

  useEffect(() => {
    // リロードしたときにログイン状態を維持するために、jwtを検証します。
    validateJwtToken(
      (res: jwtPayload) => {
        const loggedInUser: User = { id: res.userId, name: res.userName }
        gameSocket.emit('loggedIn', loggedInUser)
        setLoginUser(loggedInUser)
        setHasResponse(true)
      },
      () => {
        setHasResponse(true)
      }
    )
  }, [])

  if (!hasResponse) return <></>

  // prettier-ignore
  return (
    <div className="App">
      <GlobalContext.Provider value={context}>
        <BrowserRouter>
          <Header></Header>
          <Notification />
          <div>
            <Routes>
              <Route path="/"            element={<TopPage />} />
              <Route path="/game"        element={<Private element={<Game />}      />} />
              <Route path="/matchlist"   element={<Private element={<MatchList />} />} />
              <Route path="/chat"        element={<Private element={<Chat />}      />} />
              <Route path="/chatlist"    element={<Private element={<ChatList />}  />} />
              <Route path="/chatroom"    element={<Private element={<ChatRoom />}  />} />
              <Route path="/profile/:id" element={<Private element={<Profile />}   />} />
              <Route path="/callback"    element={<Auth42callback />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  )
}
