import { useContext, useEffect, useState, type ReactElement } from 'react'
import { OwnerIcon } from '../utils/Icon/OwnerIcon'
import { AdminButton } from './AdminButton'
import { BanButton } from './BanButton'
import {
  isOwner,
  isTargetAdmin,
  isTargetBanned,
  isTargetMuted
} from '../utils/userStatusUtils'
import { AdminIcon } from '../utils/Icon/AdminIcon'
import { DeleteMemberButton } from '../utils/Button/DeleteMemberButton'
import { BannedIcon } from '../utils/Icon/BannedIcon'
import { MuteButton } from './MuteButton'
import { MutedIcon } from '../utils/Icon/MutedIcon'
import { getAllUsersRequest } from '../../../utils/userAxios'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'

export const UserListDisplay = (props: {
  chatRoomMemberList: ChatRoomMember[]
}): ReactElement => {
  const room = useContext(ChatRoomContext)
  const updateMemberList = useContext(ChatRoomRefreshContext)

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
            <OwnerIcon isOwner={isOwner(member, room)}></OwnerIcon>
            <AdminIcon isAdmin={isTargetAdmin(chatRoomMember)} />
            <BannedIcon isBanned={isTargetBanned(chatRoomMember)} />
            <MutedIcon isMuted={isTargetMuted(chatRoomMember)} />
            <BanButton member={member} currentChatRoomMember={chatRoomMember} />
            <MuteButton
              member={member}
              currentChatRoomMember={chatRoomMember}
            />
            <AdminButton
              member={member}
              currentChatRoomMember={chatRoomMember}
            />
            <DeleteMemberButton
              room={room}
              member={member}
              onClickCallback={updateMemberList}
              msg={'Delete User from Room'}
            />
          </li>
        )
      })}
    </ul>
  )
}
