interface ChatRoomMember {
  chatRoomId: number
  userId: number
  isBanned: boolean
  isAdministrator: boolean
}

interface ChatRoomMemberPK {
  chatRoomId: number
  userId: number
}
