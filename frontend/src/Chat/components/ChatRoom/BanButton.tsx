import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'
import { isOwner, isTargetBanned } from '../utils/userStatusUtils'

const BanMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  ban_until: Date
  msg: string
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          ban_until: props.ban_until
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      {props.msg}
    </Button>
  )
}

const BanOFFMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          ban_until: undefined
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      Ban 解除
    </Button>
  )
}

export const BanButton = (props: {
  member: User
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const room = useContext(ChatRoomContext)
  if (isOwner(props.member, room)) return <></>

  // 10秒
  const banSec = 10
  const isBanned: boolean = isTargetBanned(props.currentChatRoomMember)
  return isBanned ? (
    <>
      <BanOFFMemberButton {...props} />
    </>
  ) : (
    <>
      <BanMemberButton
        {...props}
        ban_until={new Date(2023, 12, 31, 23, 59, 0)}
        msg="Ban"
      />
      <BanMemberButton
        {...props}
        ban_until={new Date(Date.now() + banSec * 1000)}
        msg="Ban 10sec"
      />
    </>
  )
}
