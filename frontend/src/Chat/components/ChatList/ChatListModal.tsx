import { useState, type ReactElement } from 'react'
import { Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap'
import { updateChatRoomRequest } from '../utils/requestUtils'

const PublicSelectDropdownButton = (props: {
  setPublicId: React.Dispatch<React.SetStateAction<publicIdType>>
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
            props.setPublicId('public')
            break
          case 'private':
            props.setPublicId('private')
            break
          case 'protected':
            props.setPublicId('protected')
            break
        }
      }}
    >
      <Dropdown.Item eventKey="public">public</Dropdown.Item>
      <Dropdown.Item eventKey="private">private</Dropdown.Item>
      <Dropdown.Item eventKey="protected">protected</Dropdown.Item>
    </DropdownButton>
  )
}

export const ChatListModal = (props: {
  user: User
  showCreateRoomModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  const [newRoomName, setNewRoomName] = useState<string>('')
  const [publicId, setPublicId] = useState<publicIdType>('public')
  const [password, setPassword] = useState<string>('')

  const handleCreateRoom = (): void => {
    const requestData: ChatRoomReqDto = {
      name: newRoomName,
      created_by: props.user.id,
      created_by_user_id: props.user.id,
      public_id: publicId,
      password: publicId === 'protected' ? password : undefined
    }
    updateChatRoomRequest(requestData, props.handleModalClose)
  }

  return (
    <>
      <Modal show={props.showCreateRoomModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>create new Room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form.Control
              placeholder="New Room Name"
              onChange={(e) => {
                setNewRoomName(e.target.value)
              }}
              isInvalid={newRoomName === ''}
            />
            <PublicSelectDropdownButton
              setPublicId={setPublicId}
            ></PublicSelectDropdownButton>
            <Form.Control
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              disabled={publicId !== 'protected'}
              isInvalid={publicId === 'protected' && password === ''}
            />
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateRoom}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
