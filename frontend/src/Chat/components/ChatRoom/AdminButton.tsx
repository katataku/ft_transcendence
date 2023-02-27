import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isAdmin, isOwner } from '../utils/userStatusUtils'

const AdminMemberButton = (props: {
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
          isBanned: false,
          isAdministrator: true
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Admin
    </Button>
  )
}

const AdminOFFMemberButton = (props: {
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
          isBanned: false,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Admin 解除
    </Button>
  )
}

export const AdminButton = (props: {
  room: ChatRoom
  member: User
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
  openAsOwner: boolean
}): JSX.Element => {
  if (!props.openAsOwner) return <></>
  if (isOwner(props.member, props.room)) return <></>

  const isAdminBool: boolean = isAdmin(
    props.member,
    props.room,
    props.chatRoomMemberList
  )

  return isAdminBool ? (
    <>
      <AdminOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} member={props.member} />
    </>
  )
}
