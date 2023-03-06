import { type ReactElement, useState, createContext, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Game, MatchList } from './Game'
import { ChatList, Chat, ChatRoom } from './Chat'
import { TopPage } from './TopPage'

// interfaceの初期化をしろとeslintに怒られますが、Setterは初期化できないため、ここだけeslintを無視します。
export const GlobalContext = createContext<GlobalContext>({} as GlobalContext) // eslint-disable-line

const localStorageKey: string = 'ft_trans_user'

export function App(): ReactElement {
  const [loginUser, setLoginUser] = useState<User>({
    id: 0,
    name: ''
  })
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)

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
    isSignedIn
      ? localStorage.setItem(localStorageKey, JSON.stringify(loginUser))
      : localStorage.removeItem(localStorageKey)
  }, [isSignedIn])

  return (
    <div className="App">
      <GlobalContext.Provider value={context}>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/game" element={<Game />} />
              <Route path="/matchlist" element={<MatchList />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chatlist" element={<ChatList />} />
              <Route path="/chatroom" element={<ChatRoom />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  )
}
