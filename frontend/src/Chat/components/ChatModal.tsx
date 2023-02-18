import { type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'

export const ChatModal = (props: {
  showModal: boolean
  targetUser: User
  handleModalClose: () => void
  handleKickButtonClick: () => void
  handleMuteButtonClick: ({ muteSec }: { muteSec: number }) => void
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
          <Button
            variant="primary"
            onClick={() => {
              props.handleMuteButtonClick({ muteSec: 0 })
            }}
          >
            Mute
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.handleMuteButtonClick({ muteSec: 10 })
            }}
          >
            Mute 10sec
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
