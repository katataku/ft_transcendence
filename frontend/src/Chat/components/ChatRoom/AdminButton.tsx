import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'
import { isOwner, isTargetAdmin } from '../utils/userStatusUtils'

const AdminMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          isAdministrator: true
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      Admin
    </Button>
  )
}

const AdminOFFMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      Admin 解除
    </Button>
  )
}

export const AdminButton = (props: {
  member: User
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const { loginUser } = useContext(GlobalContext)
  const room = useContext(ChatRoomContext)

  // 管理者権限の変更はオーナーしかできない
  if (!isOwner(loginUser, room)) return <></>

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
