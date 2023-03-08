import { type ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'
import { CreateChatRoomModal } from './CreateChatRoomModal'

export const CreateRoomButton = (props: {
  updateChatRoomList: () => void
}): ReactElement => {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)

  const handleModalClose = (): void => {
    setShowCreateRoomModal(false)
    props.updateChatRoomList()
  }

  return (
    <p>
      <CreateChatRoomModal
        showModal={showCreateRoomModal}
        handleModalClose={handleModalClose}
      ></CreateChatRoomModal>
      <Button
        data-cy="create-room-button"
        onClick={() => {
          setShowCreateRoomModal(true)
        }}
      >
        create new room
      </Button>
    </p>
  )
}
