import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Match } from './Game/Match'
import { Login } from './Login'
import { ChatList } from './Chat/ChatList'
import { Chat } from './Chat/Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match" element={<Match />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatlist" element={<ChatList />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
