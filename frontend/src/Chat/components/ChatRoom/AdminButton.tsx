import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { ChatRoomContext } from '../utils/context'
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
  member: User
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  const room = useContext(ChatRoomContext)

  // 管理者権限の変更はオーナーしかできない
  if (!isOwner(props.user, room)) return <></>

  // オーナーは管理者権限を変更できない
  if (isOwner(props.member, room)) return <></>

  const isAdmin: boolean = isTargetAdmin(props.currentChatRoomMember)
  return isAdmin ? (
    <>
      <AdminOFFMemberButton {...props} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} />
    </>
  )
}
