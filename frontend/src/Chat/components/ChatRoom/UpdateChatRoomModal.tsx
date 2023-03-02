import { useContext, type ReactElement } from 'react'
import { ChatRoomSetupModal } from '../utils/Modal/ChatRoomSetupModal'
import { updateChatRoomRequest } from '../../../utils/chatRoomAxios'
import { ChatRoomContext } from '../utils/context'

export const UpdateChatRoomModal = (props: {
  user: User
  showModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  const room = useContext(ChatRoomContext)

  const requestSendFunction = (
    requestData: ChatRoomReqDto,
    callback: () => void
  ): void => {
    updateChatRoomRequest(room, requestData, callback)
  }
  return (
    <ChatRoomSetupModal
      {...props}
      modalHeaderMessage={'Update Room'}
      submitButtonMessage={'Update'}
      requestSendFunction={requestSendFunction}
    ></ChatRoomSetupModal>
  )
}
