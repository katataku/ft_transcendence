import { useEffect, useState } from 'react'
import '../assets/styles.css'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import axios from 'axios'
import { MessageDisplay } from './ChatMessageDisplay'
import { MessageSend } from './ChatMessageSend'

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const socket = io(ServerURL)

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// Websocket通信を管理。
// 描画などは各モジュールに移譲する。
export function Chat(): ReactElement {
  const [messageEventList, setMessageEventList] = useState<messageEventType[]>(
    []
  )
  const { room, user }: ChatState = useLocation().state
  const navigate = useNavigate()

  const handleConnectEvent = (): void => {
    console.log('socket connected.')
  }

  const handleMessageEvent = (data: messageEventType): void => {
    console.log('message received:' + JSON.stringify(data))
    if (data.room === room) {
      setMessageEventList((eventList) => [...eventList, data])
    }
  }

  const handleKickEvent = (item: kickEventType): void => {
    console.log('kick received:' + JSON.stringify(item))
    const ChatListState: ChatListState = { kicked: true }
    if (item.room === room && item.userId === user.id) {
      navigate('/chatlist', { state: ChatListState })
    }
  }

  useEffect(() => {
    console.log('room : ' + room)
    console.log('user id : ' + String(user.id))
    console.log('user name :' + String(user.name))
    socket.on('connect', handleConnectEvent)
    socket.on('message', handleMessageEvent)
    socket.on('kickNotification', handleKickEvent)
    socket.emit('channelNotification', room)

    return () => {
      socket.off('connect')
      socket.off('message')
      socket.off('kickNotification')
    }
  }, [])

  const sendMessageEvent = (msg: string): void => {
    const obj: messageEventType = {
      key: Date.now(),
      user,
      room,
      msg
    }
    const sendMsg: string = JSON.stringify(obj)
    socket.emit('message', obj)
    console.log('message sent:' + sendMsg)
  }

  // kick処理はWebsocketで通信する。
  const sendKickEvent = (userId: number): void => {
    const sendMsg: kickEventType = {
      key: Date.now(),
      userId,
      room
    }
    socket.emit('kickNotification', sendMsg)
  }

  return (
    <>
      <div className="Chat">
        <h1>Chat Page</h1>
        <MessageDisplay
          user={user}
          room={room}
          messageEventList={messageEventList}
          SendKickEvent={sendKickEvent}
        ></MessageDisplay>
        <MessageSend
          user={user}
          room={room}
          sendMessageEvent={sendMessageEvent}
        ></MessageSend>
      </div>
    </>
  )
}
