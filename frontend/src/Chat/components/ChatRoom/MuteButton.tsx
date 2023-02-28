import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isOwner } from '../utils/userStatusUtils'

const MuteMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
  mute_until: Date
  msg: string
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          mute_until: props.mute_until
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      {props.msg}
    </Button>
  )
}

const MuteOFFMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          mute_until: undefined
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Mute 解除
    </Button>
  )
}

export const MuteButton = (props: {
  room: ChatRoom
  member: User
  currentChatRoomMember: ChatRoomMember
  isMuted: boolean
  updateMemberList: () => void
}): JSX.Element => {
  if (isOwner(props.member, props.room)) return <></>

  // 10秒
  const muteSec = 10

  return props.isMuted ? (
    <>
      <MuteOFFMemberButton {...props} />
    </>
  ) : (
    <>
      <MuteMemberButton
        {...props}
        mute_until={new Date(2023, 12, 31, 23, 59, 0)}
        msg="Mute"
      />
      <MuteMemberButton
        {...props}
        mute_until={new Date(Date.now() + muteSec * 1000)}
        msg="Mute 10sec"
      />
    </>
  )
}
