import { useContext } from 'react'
import { GlobalContext } from '../../../App'

function getMember(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): ChatRoomMember | undefined {
  return chatRoomMemberList.find(
    (item) => item.userId === user.id && item.chatRoomId === room.id
  )
}

export function isAdmin(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  return isTargetAdmin(getMember(user, room, chatRoomMemberList))
}

export function isTargetAdmin(
  ChatRoomMember: ChatRoomMember | undefined
): boolean {
  return ChatRoomMember?.isAdministrator ?? false
}

export function isBanned(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  return isTargetBanned(getMember(user, room, chatRoomMemberList))
}

export function isTargetBanned(
  chatRoomMemberList: ChatRoomMember | undefined
): boolean {
  const banUntil = chatRoomMemberList?.ban_until
  if (banUntil === null || banUntil === undefined) return false
  return banUntil.getTime() > new Date().getTime()
}

export function isMuted(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  return isTargetMuted(getMember(user, room, chatRoomMemberList))
}

export function isTargetMuted(
  chatRoomMemberList: ChatRoomMember | undefined
): boolean {
  const muteUntil = chatRoomMemberList?.mute_until
  if (muteUntil === null || muteUntil === undefined) return false
  return muteUntil.getTime() > new Date().getTime()
}

export function isOwner(user: User, room: ChatRoom): boolean {
  return room.owner_id === user.id
}

export function isLoginUserOwner(room: ChatRoom): boolean {
  const { loginUser } = useContext(GlobalContext)
  return isOwner(loginUser, room)
}
