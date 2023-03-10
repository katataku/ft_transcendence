import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { updateChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'
import { isOwner, isTargetMuted } from '../utils/userStatusUtils'

const MuteMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
  mute_until: Date
  msg: string
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          mute_until: props.mute_until
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      {props.msg}
    </Button>
  )
}

const MuteOFFMemberButton = (props: {
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          ...props.currentChatRoomMember,
          mute_until: undefined
        }
        updateChatRoomMembersRequest(requestData, updateMemberList)
      }}
    >
      Mute 解除
    </Button>
  )
}

export const MuteButton = (props: {
  member: User
  currentChatRoomMember: ChatRoomMember
}): JSX.Element => {
  const room = useContext(ChatRoomContext)
  if (isOwner(props.member, room)) return <></>

  // 10秒
  const muteSec = 10

  const isMuted: boolean = isTargetMuted(props.currentChatRoomMember)
  return isMuted ? (
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
