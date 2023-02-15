import * as React from 'react'
import '../assets/styles.css'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, type ReactElement } from 'react'
import { Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

export function ChatList(): ReactElement {
  const [name, setName] = React.useState<string>('')
  const [newRoom, setNewRoom] = React.useState<string>('')
  const [roomList, setRoomList] = React.useState<ChatRoom[]>([])

  const { kicked }: ChatListState = useLocation().state
  const [show, setShow] = React.useState<boolean>(kicked)

  const alertElement: JSX.Element = show ? (
    <Alert
      variant="danger"
      onClose={() => {
        setShow(false)
      }}
      dismissible
    >
      <Alert.Heading>You are kicked from the Chat room! </Alert.Heading>
    </Alert>
  ) : (
    <></>
  )

  const updateChatRoomList = (): void => {
    axios
      .get<ChatRoom[]>('/chatRoom')
      .then((response) => {
        setRoomList(response.data.map((value: ChatRoom) => value))
      })
      .catch(() => {
        alert('エラーです！')
      })
  }

  useEffect(() => {
    updateChatRoomList()
  }, [])

  const handleCreateRoom = (): void => {
    const requestData: ChatRoom = {
      name: newRoom,
      created_by: name,
      isPublic: true
    }
    axios
      .post<ChatRoom>('/chatRoom', requestData)
      .then((_response) => {
        setNewRoom('')
        updateChatRoomList()
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  return (
    <>
      {alertElement}
      <div className="Chat">
        <p>Enter your name and Move on to a chat room.</p>
        <p>
          name:
          <label>
            <input
              name="name"
              type="text"
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </label>
        </p>
        <ul>
          {roomList.map((room, index) => (
            <li key={index}>
              <Link to="/chat" state={{ room: room.name, name }}>
                Move to Chat {room.name}
              </Link>
              <button
                onClick={() => {
                  axios
                    .delete('/chatRoom/' + String(room.id))
                    .then((_response) => {
                      updateChatRoomList()
                    })
                    .catch((reason) => {
                      alert('エラーです！')
                      console.log(reason)
                    })
                }}
              >
                delete room
              </button>
            </li>
          ))}
        </ul>
        <p>
          new room:
          <label>
            <input
              type="text"
              value={newRoom}
              onChange={(e) => {
                setNewRoom(e.target.value)
              }}
            />
          </label>
          <button onClick={handleCreateRoom}>create room</button>
        </p>
      </div>
    </>
  )
}
