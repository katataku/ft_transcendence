import { type ReactElement } from 'react'
import { ChatRoomSetupModal } from '../utils/Modal/ChatRoomSetupModal'
import { updateChatRoomRequest } from '../../../utils/chatRoomAxios'

export const UpdateChatRoomModal = (props: {
  user: User
  room: ChatRoom
  showModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  const requestSendFunction = (
    requestData: ChatRoomReqDto,
    callback: () => void
  ): void => {
    updateChatRoomRequest(props.room, requestData, callback)
  }
  return (
    <ChatRoomSetupModal
      {...props}
      submitButtonMessage={'Create'}
      requestSendFunction={requestSendFunction}
    ></ChatRoomSetupModal>
  )
}
