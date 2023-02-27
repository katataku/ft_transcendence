import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isOwner } from '../utils/userStatusUtils'

const BanMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          ban_until: new Date(2023, 12, 31, 23, 59, 0),
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Ban
    </Button>
  )
}

const BanOFFMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          ban_until: undefined,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Ban 解除
    </Button>
  )
}

export const BanButton = (props: {
  room: ChatRoom
  member: User
  isBanned: boolean
  updateMemberList: () => void
}): JSX.Element => {
  if (isOwner(props.member, props.room)) return <></>

  return props.isBanned ? (
    <>
      <BanOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <BanMemberButton {...props} member={props.member} />
    </>
  )
}
