import { useContext, useEffect, useState } from 'react'
import '../../assets/styles.css'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import { MessageDisplay } from './ChatMessageDisplay'
import { MessageSend } from './ChatMessageSend'
import { GlobalContext } from '../../../App'

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const socket = io(ServerURL)

// Websocket通信を管理。
// 描画などは各モジュールに移譲する。
export function Chat(): ReactElement {
  const [messageEventList, setMessageEventList] = useState<messageEventType[]>(
    []
  )
  const { loginUser } = useContext(GlobalContext)
  const { room }: ChatState = useLocation().state
  const navigate = useNavigate()

  const handleConnectEvent = (): void => {
    console.log('socket connected.')
  }

  const handleMessageEvent = (data: messageEventType): void => {
    console.log('message received:' + JSON.stringify(data))
    if (data.room === room.name) {
      setMessageEventList((eventList) => [...eventList, data])
    }
  }

  const handleKickEvent = (item: kickEventType): void => {
    console.log('kick received:' + JSON.stringify(item))
    const ChatListState: ChatListState = { kicked: true }
    if (item.room === room.name && item.userId === loginUser.id) {
      navigate('/chatlist', { state: ChatListState })
    }
  }

  useEffect(() => {
    console.log('room : ' + String(room.name))
    console.log('user id : ' + String(loginUser.id))
    console.log('user name :' + String(loginUser.name))
    socket.on('connect', handleConnectEvent)
    socket.on('message', handleMessageEvent)
    socket.on('kickNotification', handleKickEvent)
    socket.emit('channelNotification', room.name)

    return () => {
      socket.off('connect')
      socket.off('message')
      socket.off('kickNotification')
    }
  }, [])

  const sendMessageEvent = (msg: string): void => {
    const obj: messageEventType = {
      key: Date.now(),
      user: loginUser,
      room: room.name,
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
      room: room.name
    }
    socket.emit('kickNotification', sendMsg)
  }

  return (
    <>
      <div className="Chat">
        <h1>Chat Page</h1>
        <MessageDisplay
          room={room}
          messageEventList={messageEventList}
          SendKickEvent={sendKickEvent}
        ></MessageDisplay>
        <MessageSend
          room={room.name}
          sendMessageEvent={sendMessageEvent}
        ></MessageSend>
      </div>
    </>
  )
}
