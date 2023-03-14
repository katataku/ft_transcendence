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

// interfaceの初期化をしろとeslintに怒られますが、Setterは初期化できないため、ここだけeslintを無視します。
export const GlobalContext = createContext<GlobalContext>({} as GlobalContext) // eslint-disable-line

const localStorageKey: string = 'ft_trans_user'

export function App(): ReactElement {
  const [loginUser, setLoginUser] = useState<User>({
    id: 0,
    name: ''
  })
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const gameSocket = useContext(GameSocketContext)

  const context: GlobalContext = {
    loginUser,
    setLoginUser,
    isSignedIn,
    setIsSignedIn
  }

  useEffect(() => {
    const data = localStorage.getItem(localStorageKey)
    if (data !== null) {
      setIsSignedIn(true)
      setLoginUser(JSON.parse(data))
    }
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      localStorage.setItem(localStorageKey, JSON.stringify(loginUser))
      gameSocket.emit('loggedIn', loginUser)
    } else {
      localStorage.removeItem(localStorageKey)
    }
  }, [isSignedIn])

  return (
    <div className="App">
      <GlobalContext.Provider value={context}>
        <BrowserRouter>
          <Header></Header>
          <Notification />
          <div>
            <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/game" element={<Game />} />
              <Route path="/matchlist" element={<MatchList />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chatlist" element={<ChatList />} />
              <Route path="/chatroom" element={<ChatRoom />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/callback" element={<Auth42callback />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  )
}
