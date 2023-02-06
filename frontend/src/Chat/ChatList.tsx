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
          <li>
            <Link to="/chat" state={{ room: 'room1', name }}>
              Move to Chat room 1
            </Link>
          </li>
          <li>
            <Link to="/chat" state={{ room: 'room2', name }}>
              Move to Chat room 2
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
