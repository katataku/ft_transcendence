import * as React from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import { type ReactElement } from 'react'

export function ChatList(): ReactElement {
  const [name, setName] = React.useState<string>('')
  const [newRoom, setNewRoom] = React.useState<string>('')
  const [roomList, setRoomList] = React.useState<string[]>(['room1', 'room2'])

  return (
    <>
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
