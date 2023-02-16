import * as React from 'react'
import '../assets/styles.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, type ReactElement } from 'react'
import { Alert, Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// フリー素材のアイコン。
// ただし、LICENSEで再配布が禁止されているため、publicディレクトリに保存せずに、画像URLへ直接リンクする。
// https://iconbox.fun/about/#LICENSE
const _publicIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_open_24.png'
const privateIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_24.png'

const PublicSelectDropdownButton = (props: {
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const [title, setTitle] = React.useState<string>('public')

  return (
    <DropdownButton
      id="dropdown-basic-button"
      variant="info"
      title={title}
      onSelect={(
        op: string | null,
        _e: React.SyntheticEvent<unknown>
      ): void => {
        setTitle(op ?? 'select')
        switch (op) {
          case 'public':
            props.setIsPublic(true)
            break
          case 'private':
            props.setIsPublic(false)
            break
        }
      }}
    >
      <Dropdown.Item eventKey="public">public</Dropdown.Item>
      <Dropdown.Item eventKey="private">private</Dropdown.Item>
    </DropdownButton>
  )
}

const CreateRoomModal = (props: {
  user: User
  showCreateRoomModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  const [newRoomName, setNewRoomName] = React.useState<string>('')
  const [isPublic, setIsPublic] = React.useState<boolean>(true)

  const handleCreateRoom = (): void => {
    const requestData: ChatRoom = {
      name: newRoomName,
      created_by: props.user.id,
      isPublic
    }
    axios
      .post<ChatRoom>('/chatRoom', requestData)
      .then((_response) => {
        props.handleModalClose()
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  return (
    <>
      <Modal show={props.showCreateRoomModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>create new Room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            new room:
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => {
                setNewRoomName(e.target.value)
              }}
            />
            <PublicSelectDropdownButton
              setIsPublic={setIsPublic}
            ></PublicSelectDropdownButton>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCreateRoom()
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export function ChatList(): ReactElement {
  const [user, setUser] = React.useState<User>({ id: 0, name: '' })
  const [name, setName] = React.useState<string>('')
  const [roomList, setRoomList] = React.useState<ChatRoom[]>([])
  const [showCreateRoomModal, setShowCreateRoomModal] = React.useState(false)

  const { kicked }: ChatListState = useLocation().state
  const [show, setShow] = React.useState<boolean>(kicked)
  const navigate = useNavigate()

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

  const handleModalClose = (): void => {
    setShowCreateRoomModal(false)
    updateChatRoomList()
  }

  const handleDeleteRoom = (room: ChatRoom): void => {
    axios
      .delete('/chatRoom/' + String(room.id))
      .then((_response) => {
        updateChatRoomList()
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  const StateInfo = (): ReactElement => {
    return (
      <>
        <p>user id: {user.id}</p>
        <p>user name: {user.name}</p>
      </>
    )
  }

  return (
    <>
      {alertElement}
      <CreateRoomModal
        user={user}
        showCreateRoomModal={showCreateRoomModal}
        handleModalClose={handleModalClose}
      ></CreateRoomModal>
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
            <Button
              onClick={() => {
                axios
                  .get<User>('/user/' + name)
                  .then((response) => {
                    setUser(response.data)
                  })
                  .catch(() => {
                    alert('エラーです！')
                  })
              }}
            >
              get User info
            </Button>
          </label>
        </p>
        <StateInfo></StateInfo>
        <ul>
          {roomList.map((room, index) => {
            const isPublicIcon: JSX.Element = room.isPublic ? (
              <></>
            ) : (
              <img src={privateIconURL} alt="new" width="20" height="20" />
            )

            const enterButton: JSX.Element = (
              <Button
                onClick={() => {
                  navigate('/chat', { state: { room: room.name, user } })
                }}
              >
                Enter
              </Button>
            )
            const deleteRoomButton: JSX.Element = (
              <Button
                variant="outline-danger"
                onClick={() => {
                  handleDeleteRoom(room)
                }}
              >
                delete room
              </Button>
            )

            return (
              <li key={index}>
                {room.name}
                {isPublicIcon}
                {enterButton}
                {deleteRoomButton}
              </li>
            )
          })}
        </ul>
        <p>
          <Button
            onClick={() => {
              setShowCreateRoomModal(true)
            }}
          >
            create new room
          </Button>
        </p>
      </div>
    </>
  )
}
