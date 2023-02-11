import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Game } from './Game'
import { Login } from './Login'
import { ChatList, Chat } from './Chat'
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
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatlist" element={<ChatList />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
