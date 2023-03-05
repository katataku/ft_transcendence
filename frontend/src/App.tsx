import { type ReactElement, useState, createContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Game, MatchList } from './Game'
import { ChatList, Chat, ChatRoom } from './Chat'
import { TopPage } from './TopPage'
import { Profile } from './Profile'

// interfaceの初期化をしろとeslintに怒られますが、Setterは初期化できないため、ここだけeslintを無視します。
export const GlobalContext = createContext<GlobalContext>({} as GlobalContext) // eslint-disable-line

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
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  )
}
