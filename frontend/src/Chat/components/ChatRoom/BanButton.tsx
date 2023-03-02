import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { isOwner, isTargetBanned } from '../utils/userStatusUtils'

const BanMemberButton = (props: {
  updateMemberList: () => void
  currentChatRoomMember: ChatRoomMember
  ban_until: Date
  msg: string
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          ban_until: props.ban_until
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      {props.msg}
    </Button>
  )
}

const BanOFFMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          ban_until: undefined
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
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  if (isOwner(props.member, props.room)) return <></>

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
