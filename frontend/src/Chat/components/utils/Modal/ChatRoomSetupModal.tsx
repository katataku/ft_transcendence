import { type ReactElement, useState, useContext } from 'react'
import { Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap'
import { GlobalContext } from '../../../../App'

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

export const ChatRoomSetupModal = (props: {
  showModal: boolean
  handleModalClose: () => void
  modalHeaderMessage: string
  submitButtonMessage: string
  requestSendFunction: (
    requestData: ChatRoomReqDto,
    callback: () => void
  ) => void
}): ReactElement => {
  const [newRoomName, setNewRoomName] = useState<string>('')
  const [publicId, setPublicId] = useState<publicIdType>('public')
  const [password, setPassword] = useState<string>('')
  const { loginUser } = useContext(GlobalContext)

  const handleSubmitOnClick = (): void => {
    const requestData: ChatRoomReqDto = {
      name: newRoomName,
      created_by: loginUser.id,
      created_by_user_id: loginUser.id,
      public_id: publicId,
      password: publicId === 'protected' ? password : undefined
    }
    props.requestSendFunction(requestData, props.handleModalClose)
  }

  return (
    <>
      <Modal show={props.showModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeaderMessage}</Modal.Title>
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
          <Button
            variant="primary"
            onClick={handleSubmitOnClick}
            disabled={publicId === 'protected' && password === ''}
          >
            {props.submitButtonMessage}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
