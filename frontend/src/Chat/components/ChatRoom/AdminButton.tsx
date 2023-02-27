import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isOwner } from '../utils/userStatusUtils'

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
          ban_until: undefined,
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
          ban_until: undefined,
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
  isAdmin: boolean
  updateMemberList: () => void
  openAsOwner: boolean
}): JSX.Element => {
  // 管理者権限の変更はオーナーしかできない
  if (!props.openAsOwner) return <></>

  // オーナーは管理者権限を変更できない
  if (isOwner(props.member, props.room)) return <></>

  return props.isAdmin ? (
    <>
      <AdminOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} member={props.member} />
    </>
  )
}
