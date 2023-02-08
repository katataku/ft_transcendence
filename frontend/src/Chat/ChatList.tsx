import * as React from 'react'
import './styles.css'
import { Link, useLocation } from 'react-router-dom'
import { type ReactElement } from 'react'
import { Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

interface State {
  banned: boolean
}

export function ChatList(): ReactElement {
  const [name, setName] = React.useState<string>('')
  const [newRoom, setNewRoom] = React.useState<string>('')
  const [roomList, setRoomList] = React.useState<string[]>(['room1', 'room2'])

  const location = useLocation()
  const { banned }: State = location.state
  const [show, setShow] = React.useState<boolean>(banned)

  const alertElement: JSX.Element = show ? (
    <Alert
      variant="danger"
      onClose={() => {
        setShow(false)
      }}
      dismissible
    >
      <Alert.Heading>You are banned from the Chat room! </Alert.Heading>
    </Alert>
  ) : (
    <></>
  )

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
              <Link to="/chat" state={{ room, name }}>
                Move to Chat {room}
              </Link>
              <button
                onClick={() => {
                  setRoomList((roomList) =>
                    roomList.filter((item) => !(item === room))
                  )
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
          <button
            onClick={() => {
              setRoomList((roomList) => [...roomList, newRoom])
              setNewRoom('')
            }}
          >
            create room
          </button>
        </p>
      </div>
    </>
  )
}
