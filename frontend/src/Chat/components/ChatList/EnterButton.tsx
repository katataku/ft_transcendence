import { type ReactElement, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { chatRoomAuthRequest } from '../../../utils/chatRoomAxios'

export const PasswordPromptModal = (props: {
  room: ChatRoom
  showPasswordPromptModal: boolean
  handleModalClose: () => void
  passwordAuthSuccess: () => void
}): ReactElement => {
  const [password, setPassword] = useState<string>('')

  const handleCheckPassword = (): void => {
    const requestData: ChatRoomAuthReqDto = {
      password
    }
    chatRoomAuthRequest(props.room, requestData, props.passwordAuthSuccess)
  }

  return (
    <>
      <Modal
        show={props.showPasswordPromptModal}
        onHide={props.handleModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Protected Room Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form.Control
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCheckPassword}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// チャットルームに入室するためのボタンを表示する。
// roomMemberである場合、参加ボタンを表示する。
export const EnterButton = (props: {
  user: User
  room: ChatRoom
  isRoomMember: boolean
  isBanned: boolean
}): JSX.Element => {
  const navigate = useNavigate()
  const room = props.room
  const user = props.user

  const [showPasswordPromptModal, setShowPasswordPromptModal] = useState(false)

  // roomMemberでない場合、参加ボタンを表示しない。
  if (!props.isRoomMember) return <></>

  // Banされている場合、参加ボタンを表示しない。
  if (props.isBanned) return <></>

  const handleModalClose = (): void => {
    setShowPasswordPromptModal(false)
  }

  const passwordAuthSuccess = (): void => {
    handleModalClose()
    navigate('/chat', {
      state: { room: room.name, user }
    })
  }

  // パスワードが必要な場合、パスワード入力モーダルを表示する。
  // パスワードが不要な場合、チャットルームに入室する。
  const handleButtonClick = (): void => {
    if (room.public_id === 'protected') {
      setShowPasswordPromptModal(true)
    } else {
      passwordAuthSuccess()
    }
  }
  return (
    <>
      <PasswordPromptModal
        {...props}
        showPasswordPromptModal={showPasswordPromptModal}
        handleModalClose={handleModalClose}
        passwordAuthSuccess={passwordAuthSuccess}
      ></PasswordPromptModal>
      <Button onClick={handleButtonClick}>Enter</Button>
    </>
  )
}
