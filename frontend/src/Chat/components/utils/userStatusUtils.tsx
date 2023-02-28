export function isAdmin(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  const isAdmin = chatRoomMemberList.find(
    (item) => item.userId === user.id && item.chatRoomId === room.id
  )?.isAdministrator
  return isAdmin ?? false
}

export function isBanned(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  const banUntil = chatRoomMemberList.find(
    (item) => item.userId === user.id && item.chatRoomId === room.id
  )?.ban_until
  if (banUntil === null || banUntil === undefined) return false
  return banUntil.getTime() > new Date().getTime()
}

export function isMuted(
  user: User,
  room: ChatRoom,
  chatRoomMemberList: ChatRoomMember[]
): boolean {
  const muteUntil = chatRoomMemberList.find(
    (item) => item.userId === user.id && item.chatRoomId === room.id
  )?.mute_until
  if (muteUntil === null || muteUntil === undefined) return false
  return muteUntil.getTime() > new Date().getTime()
}

export function isOwner(user: User, room: ChatRoom): boolean {
  return room.created_by_user_id === user.id
}
