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
  const isBanned = chatRoomMemberList.find(
    (item) => item.userId === user.id && item.chatRoomId === room.id
  )?.isBanned
  return isBanned ?? false
}

export function isOwner(user: User, room: ChatRoom): boolean {
  return room.created_by_user_id === user.id
}
