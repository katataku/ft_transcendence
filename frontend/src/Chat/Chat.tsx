import * as React from 'react'
import './styles.css'
import io from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { type ReactElement } from 'react'
import axios from 'axios'

interface messageEventType {
  key: number
  name: string
  room: string
  msg: string
}

interface State {
  name: string
  room: string
}

interface messageItem {
  name: string
  body: JSX.Element
}

interface muteUserList {
  muteUserId: string
  mutedUserId: string
}

// const ServerURL: string = "wss://ws.postman-echo.com/raw";
const ServerURL: string = 'ws://localhost:3002'
export function Chat(): ReactElement {
  // const [room, setRoom] = React.useState<string>("");
  // const [name, setName] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>('')
  const [itemList, setItemList] = React.useState<messageItem[]>([])
  const [socket, _setSocket] = React.useState(io(ServerURL))
  const [mutedUserList, setMutedUserList] = React.useState<string[]>([])

  const location = useLocation()
  const { room, name }: State = location.state

  React.useEffect(() => {
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
    const outerClassName: string =
      name === item.name ? 'line__right' : 'line__left'
    const innerClassName: string =
      name === item.name ? 'line__right-text' : 'line__left-text'

    return {
      name: item.name,
      body: (
        <div className={outerClassName} key={item.key}>
          <div className={innerClassName}>
            <div
              className="name"
              // For debug.
              // 名前をクリックするとミュートユーザに指定する。
              onClick={(): void => {
                setMutedUserList((mutedUserList) => [
                  ...mutedUserList,
                  item.name
                ])
              }}
            >
              {item.name}
            </div>
            <div className="text">{item.msg}</div>
          </div>
        </div>
      )
    }
  }

  socket.on('connect', () => {
    console.log('socket connected.')
  })

  socket.on('message', (data: string) => {
    console.log('message received:' + data)
    try {
      const item: messageEventType = JSON.parse(data)
      if (item.room === room) {
        setItemList([...itemList, makeItem(item)])
      }
    } catch (error) {
      console.log('message parse error.')
    }
  })

  const clickSendMessage = (msg: string): void => {
    console.log('clicked')

    const obj: messageEventType = {
      key: Date.now(),
      name,
      room,
      msg
    }
    const sendMsg: string = JSON.stringify(obj)
    socket.emit('message', sendMsg)
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
