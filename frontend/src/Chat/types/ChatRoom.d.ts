interface ChatRoomMember {
  chatRoomId: number
  userId: number
  isBanned: boolean
}

interface ChatRoomMemberPK {
  chatRoomId: number
  userId: number
}
