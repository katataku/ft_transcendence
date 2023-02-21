import { type ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'
import { ChatListModal } from './ChatListModal'

export const CreateRoomButton = (props: {
  user: User
  updateChatRoomList: () => void
}): ReactElement => {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)

  const handleModalClose = (): void => {
    setShowCreateRoomModal(false)
    props.updateChatRoomList()
  }

  return (
    <p>
      <ChatListModal
        user={props.user}
        showCreateRoomModal={showCreateRoomModal}
        handleModalClose={handleModalClose}
      ></ChatListModal>
      <Button
        onClick={() => {
          setShowCreateRoomModal(true)
        }}
      >
        create new room
      </Button>
    </p>
  )
}
