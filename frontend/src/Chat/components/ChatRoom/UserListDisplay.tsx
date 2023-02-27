import { type ReactElement } from 'react'
import { OwnerIcon } from '../utils/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import { isAdmin } from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/AdminIcon'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'

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
            <DeleteMemberButton
              {...props}
              member={member}
              onClickCallback={props.updateMemberList}
              msg={'Delete User from Room'}
            />
          </li>
        )
      })}
    </ul>
  )
}
