import { useEffect, useState, type ReactElement } from 'react'
import { OwnerIcon } from '../utils/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import {
  isOwner,
  isTargetAdmin,
  isTargetBanned,
  isTargetMuted
} from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/AdminIcon'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'
import { BannedIcon } from '../utils/BannedIcon'
import { MuteButton } from './MuteButton'
import { MutedIcon } from '../utils/MutedIcon'
import { getAllUsersRequest } from '../utils/requestUtils'

export const UserListDisplay = (props: {
  user: User
  room: ChatRoom
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): ReactElement => {
  // ユーザーの一覧を取得し、ユーザーIDをキーにした辞書を作成する
  const [allUserDict, setAllUserDict] = useState<Map<number, User>>(new Map())
  useEffect(() => {
    getAllUsersRequest((allUserList: User[]) => {
      const allUserDict = new Map<number, User>()
      allUserList.forEach((user: User) => {
        allUserDict.set(user.id, user)
      })
      setAllUserDict(allUserDict)
    })
  }, [props.chatRoomMemberList])

  // ユーザーの一覧が取得できていない場合は何も表示しない
  if (allUserDict.size === 0) return <></>
  return (
    <ul>
      {props.chatRoomMemberList.map((chatRoomMember, index) => {
        const member = allUserDict.get(chatRoomMember.userId) as User

        return (
          <li key={index}>
            {member.name}
            <OwnerIcon isOwner={isOwner(member, props.room)}></OwnerIcon>
            <AdminIcon isAdmin={isTargetAdmin(chatRoomMember)} />
            <BannedIcon isBanned={isTargetBanned(chatRoomMember)} />
            <MutedIcon isMuted={isTargetMuted(chatRoomMember)} />
            <BanButton
              {...props}
              member={member}
              currentChatRoomMember={chatRoomMember}
            />
            <MuteButton
              {...props}
              member={member}
              currentChatRoomMember={chatRoomMember}
            />
            <AdminButton
              {...props}
              member={member}
              currentChatRoomMember={chatRoomMember}
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
