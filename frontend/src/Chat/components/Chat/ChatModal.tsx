import { type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'

export const ChatModal = (props: {
  showModal: boolean
  targetUser: User
  handleModalClose: () => void
  handleKickButtonClick: () => void
}): ReactElement => {
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
          <Button variant="primary" onClick={props.handleKickButtonClick}>
            Kick
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
