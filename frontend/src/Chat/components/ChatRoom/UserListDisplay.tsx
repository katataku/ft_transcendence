import { type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { OwnerIcon } from '../utils/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import { deleteChatRoomMembersRequest } from '../utils/requestUtils'
import { isAdmin, isOwner } from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/AdminIcon'

const DeleteMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  if (isOwner(props.member, props.room)) return <></>

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMemberPK = {
          chatRoomId: props.room.id,
          userId: props.member.id
        }
        deleteChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Delete User from Room
    </Button>
  )
}

export const UserListDisplay = (props: {
  room: ChatRoom
  userList: User[]
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
  openAsOwner: boolean
}): ReactElement => {
  return (
    <ul>
      {props.userList.map((member, index) => {
        return (
          <li key={index}>
            {member.name}
            <OwnerIcon room={props.room} user={member}></OwnerIcon>
            <AdminIcon
              isAdmin={isAdmin(member, props.room, props.chatRoomMemberList)}
            />
            <BanButton {...props} member={member} />
            <AdminButton {...props} member={member} />
            <DeleteMemberButton {...props} member={member} />
          </li>
        )
      })}
    </ul>
  )
}
