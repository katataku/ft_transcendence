import { type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { updateChatRoomOwnerRequest } from '../../../utils/chatRoomAxios'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'

export const BecomeOwnerButton = (props: {
  room: ChatRoom
  userId: number
  updateChatRoomList: () => void
}): ReactElement => {
  const joinRoom = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: props.room.id,
      userId: props.userId,
      isAdministrator: true
    }
    updateChatRoomMembersRequest(requestData, props.updateChatRoomList)
  }
  return (
    <Button
      variant="info"
      onClick={() => {
        updateChatRoomOwnerRequest(props.room, { id: props.userId }, joinRoom)
      }}
    >
      Become Owner
    </Button>
  )
}
