import { type ReactElement } from 'react'
import { ChatRoomSetupModal } from '../utils/Modal/ChatRoomSetupModal'
import { createChatRoomRequest } from '../../../utils/chatRoomAxios'

export const CreateChatRoomModal = (props: {
  showModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  return (
    <ChatRoomSetupModal
      {...props}
      modalHeaderMessage={'Create New Room'}
      submitButtonMessage={'Create'}
      requestSendFunction={createChatRoomRequest}
    ></ChatRoomSetupModal>
  )
}
