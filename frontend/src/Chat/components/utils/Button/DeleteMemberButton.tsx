import { Button } from 'react-bootstrap'
import { deleteChatRoomMembersRequest } from '../../../../utils/chatRoomMemberAxios'
import { isOwner } from '../userStatusUtils'

export const DeleteMemberButton = (props: {
  room: ChatRoom
  member: User
  onClickCallback: () => void
  msg: string
}): JSX.Element => {
  // オーナーはメンバーから削除できない
  if (isOwner(props.member, props.room)) return <></>

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMemberPK = {
          chatRoomId: props.room.id,
          userId: props.member.id
        }
        deleteChatRoomMembersRequest(requestData, props.onClickCallback)
      }}
    >
      {props.msg}
    </Button>
  )
}
