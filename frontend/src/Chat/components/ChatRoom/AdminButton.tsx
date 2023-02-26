import { Button } from 'react-bootstrap'
import { AdminIcon } from '../utils/AdminIcon'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'

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
}): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.member.id
  if (isOwner) return <></>

  const isAdmin = props.chatRoomMemberList.find(
    (item) =>
      item.userId === props.member.id && item.chatRoomId === props.room.id
  )?.isAdministrator
  if (isAdmin === undefined) return <></>
  return isAdmin ? (
    <>
      <AdminIcon isAdmin={isAdmin} />
      <AdminOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} member={props.member} />
    </>
  )
}
