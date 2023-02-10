import { useEffect, useState } from 'react'
import '../assets/styles.css'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import axios from 'axios'

const ServerURL: string = 'ws://localhost:3002'
const socket = io(ServerURL)

export function Chat(): ReactElement {
  const [message, setMessage] = useState<string>('')
  const [itemList, setItemList] = useState<messageItem[]>([])
  const [mutedUserList, setMutedUserList] = useState<string[]>([])

  const { room, name }: ChatState = useLocation().state
  const navigate = useNavigate()

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:3001'
    axios
      .get('/chat-mute-user')
      .then((response) => {
        setMutedUserList(
          response.data
            .filter((value: muteUserList) => name === value.muteUserId)
            .map((value: muteUserList) => value.mutedUserId)
        )
      })
      .catch(() => {
        alert('エラーです！')
      })
  }, [])

  const makeItem = (item: messageEventType): messageItem => {
    const handleMuteButtonClick = (): void => {
      setMutedUserList((mutedUserList) => [...mutedUserList, item.name])
    }

    const handleBanButtonClick = (): void => {
      const sendMsg: banEventType = {
        key: Date.now(),
        name: item.name,
        room
      }
      socket.emit('banNotification', sendMsg)
    }

    const outerClassName: string =
      name === item.name ? 'line__right' : 'line__left'
    const innerClassName: string =
      name === item.name ? 'line__right-text' : 'line__left-text'
    const buttonObject: JSX.Element =
      name === item.name ? (
        <></>
      ) : (
        <>
          <button onClick={handleMuteButtonClick}>mute</button>
          <button onClick={handleBanButtonClick}>ban</button>
        </>
      )

    return {
      name: item.name,
      body: (
        <div className={outerClassName} key={item.key}>
          <div className={innerClassName}>
            <div className="name">
              {buttonObject}
              {item.name}
            </div>
            <div className="text">{item.msg}</div>
          </div>
        </div>
      )
    }
  }

  const handleConnectEvent = (): void => {
    console.log('socket connected.')
  }

  const handleMessageEvent = (data: messageEventType): void => {
    console.log('message received:' + JSON.stringify(data))
    if (data.room === room) {
      setItemList((itemList) => [...itemList, makeItem(data)])
    }
  }

  const handleBanEvent = (item: banEventType): void => {
    console.log('ban received:' + JSON.stringify(item))
    const ChatListState: ChatListState = { banned: true }
    if (item.room === room && item.name === name) {
      navigate('/chatlist', { state: ChatListState })
    }
  }

  useEffect(() => {
    socket.on('connect', handleConnectEvent)
    socket.on('message', handleMessageEvent)
    socket.on('banNotification', handleBanEvent)
    socket.emit('channelNotification', room)

    return () => {
      socket.off('connect')
      socket.off('message')
      socket.off('banNotification')
    }
  }, [])

  const clickSendMessage = (msg: string): void => {
    console.log('clicked')

    const obj: messageEventType = {
      key: Date.now(),
      name,
      room,
      msg
    }
    const sendMsg: string = JSON.stringify(obj)
    socket.emit('message', obj)
    console.log('message sent:' + sendMsg)
    setMessage('')
  }

  return (
    <>
      <div className="Chat">
        <h1>Chat Page</h1>
        <p>user name: {name}</p>
        <p>room: {room}</p>
        <p>muted user: {mutedUserList.join(', ')}</p>
        <div className="line__container">
          <div className="line__contents">
            {itemList
              .filter((value) => !mutedUserList.includes(value.name))
              .map((value) => value.body)}
          </div>
        </div>
        <label>
          Message:
          <input
            name="message"
            value={message}
            type="text"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
        </label>
        <button
          onClick={() => {
            if (message !== null) clickSendMessage(message)
          }}
        >
          send
        </button>
      </div>
    </>
  )
}
