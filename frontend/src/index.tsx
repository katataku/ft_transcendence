import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Game, MatchList } from './Game'
import { Login } from './Login'
import { ChatList, Chat, ChatRoom } from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/matchlist" element={<MatchList />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatlist" element={<ChatList />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
