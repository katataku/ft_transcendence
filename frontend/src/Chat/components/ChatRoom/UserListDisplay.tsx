import { type ReactElement } from 'react'
import { OwnerIcon } from '../utils/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import { isAdmin, isBanned, isOwner } from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/AdminIcon'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'
import { BannedIcon } from '../utils/BannedIcon'

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
        const isOwnerBool: boolean = isOwner(member, props.room)
        const isAdminBool: boolean = isAdmin(
          member,
          props.room,
          props.chatRoomMemberList
        )

        const isBannedBool: boolean = isBanned(
          member,
          props.room,
          props.chatRoomMemberList
        )

        return (
          <li key={index}>
            {member.name}
            <OwnerIcon isOwner={isOwnerBool}></OwnerIcon>
            <AdminIcon isAdmin={isAdminBool} />
            <BannedIcon isBanned={isBannedBool} />
            <BanButton {...props} member={member} isBanned={isBannedBool} />
            <AdminButton {...props} member={member} isAdmin={isAdminBool} />
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
