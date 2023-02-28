import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isOwner, isTargetAdmin } from '../utils/userStatusUtils'

const AdminMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
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
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
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
  user: User
  room: ChatRoom
  member: User
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  // 管理者権限の変更はオーナーしかできない
  if (!isOwner(props.user, props.room)) return <></>

  // オーナーは管理者権限を変更できない
  if (isOwner(props.member, props.room)) return <></>

  return isTargetAdmin(props.currentChatRoomMember) ? (
    <>
      <AdminOFFMemberButton {...props} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} />
    </>
  )
}
