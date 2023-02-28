import { type ReactElement } from 'react'
import { ChatRoomSetupModal } from '../utils/ChatRoomSetupModal'
import { createChatRoomRequest } from '../utils/requestUtils'

export const CreateChatRoomModal = (props: {
  user: User
  showModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  return (
    <ChatRoomSetupModal
      {...props}
      submitButtonMessage={'Create'}
      requestSendFunction={createChatRoomRequest}
    ></ChatRoomSetupModal>
  )
}
