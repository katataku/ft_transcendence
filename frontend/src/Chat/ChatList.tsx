import * as React from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import { type ReactElement } from 'react'

export function ChatList(): ReactElement {
  const [name, setName] = React.useState<string>('')
  const [roomList, _setRoomList] = React.useState<string[]>(['room1', 'room2'])

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
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
