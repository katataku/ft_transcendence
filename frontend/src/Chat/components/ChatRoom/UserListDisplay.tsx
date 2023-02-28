import { type ReactElement } from 'react'
import { OwnerIcon } from '../utils/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import { isAdmin, isBanned, isMuted, isOwner } from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/AdminIcon'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'
import { BannedIcon } from '../utils/BannedIcon'
import { MuteButton } from './MuteButton'
import { MutedIcon } from '../utils/MutedIcon'

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

        const isMutedBool: boolean = isMuted(
          member,
          props.room,
          props.chatRoomMemberList
        )

        const currentChatRoomMember: ChatRoomMember =
          props.chatRoomMemberList.find(
            (item) =>
              item.userId === member.id && item.chatRoomId === props.room.id
          ) ?? {
            userId: 0,
            chatRoomId: 0,
            ban_until: undefined,
            mute_until: undefined,
            isAdministrator: false
          }

        return (
          <li key={index}>
            {member.name}
            <OwnerIcon isOwner={isOwnerBool}></OwnerIcon>
            <AdminIcon isAdmin={isAdminBool} />
            <BannedIcon isBanned={isBannedBool} />
            <MutedIcon isMuted={isMutedBool} />
            <BanButton
              {...props}
              member={member}
              currentChatRoomMember={currentChatRoomMember}
              isBanned={isBannedBool}
            />
            <MuteButton
              {...props}
              member={member}
              currentChatRoomMember={currentChatRoomMember}
              isMuted={isMutedBool}
            />
            <AdminButton
              {...props}
              member={member}
              currentChatRoomMember={currentChatRoomMember}
              isAdmin={isAdminBool}
            />
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
