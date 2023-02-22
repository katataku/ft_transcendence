import axios from 'axios'
import { useState, type ReactElement } from 'react'
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'

const PublicSelectDropdownButton = (props: {
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const [title, setTitle] = useState<string>('public')

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

export const ChatListModal = (props: {
  user: User
  showCreateRoomModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  const [newRoomName, setNewRoomName] = useState<string>('')
  const [isPublic, setIsPublic] = useState<boolean>(true)

  const handleCreateRoom = (): void => {
    const requestData: ChatRoom = {
      name: newRoomName,
      created_by: props.user.id,
      is_public: isPublic
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
