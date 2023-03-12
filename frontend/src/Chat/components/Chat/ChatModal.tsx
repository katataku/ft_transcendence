import { type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export const ChatModal = (props: {
  showModal: boolean
  targetUser: User
  handleModalClose: () => void
  handleKickButtonClick: () => void
}): ReactElement => {
  const navigate = useNavigate()

  const handleNavigateToProfile = (): void => {
    navigate('/profile/' + String(props.targetUser.id))
  }

  return (
    <>
      <Modal show={props.showModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.targetUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNavigateToProfile}>
            プロフィール
          </Button>
          <Button variant="primary" onClick={props.handleKickButtonClick}>
            Kick
          </Button>
          <Button variant="primary" onClick={() => {}}>
            ゲーム
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
