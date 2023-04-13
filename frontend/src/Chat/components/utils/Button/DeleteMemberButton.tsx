import { Button } from 'react-bootstrap'
import { deleteChatRoomMembersRequest } from '../../../../utils/chatRoomMemberAxios'
import { isOwner } from '../userStatusUtils'
import { updateChatRoomOwnerRequest } from '../../../../utils/chatRoomAxios'

export const DeleteMemberButton = (props: {
  room: ChatRoom
  member: User
  onClickCallback: () => void
  msg: string
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMemberPK = {
          chatRoomId: props.room.id,
          userId: props.member.id
        }
        deleteChatRoomMembersRequest(requestData, props.onClickCallback)
        if (isOwner(props.member, props.room)) {
          updateChatRoomOwnerRequest(props.room, { id: -1 }, () => {})
        }
      }}
    >
      {props.msg}
    </Button>
  )
}
