import { Button } from 'react-bootstrap'
import { BannedIcon } from '../utils/BannedIcon'
import { updateChatRoomMembersRequest } from '../utils/requestUtils'
import { isBanned, isOwner } from '../utils/userStatusUtils'

const BanMemberButton = (props: {
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
          isBanned: true,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Ban
    </Button>
  )
}

const BanOFFMemberButton = (props: {
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
          isAdministrator: false
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
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): JSX.Element => {
  if (isOwner(props.member, props.room)) return <></>

  const isBannedBool = isBanned(
    props.member,
    props.room,
    props.chatRoomMemberList
  )

  return isBannedBool ? (
    <>
      <BannedIcon isBanned={isBannedBool} />
      <BanOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <BanMemberButton {...props} member={props.member} />
    </>
  )
}
