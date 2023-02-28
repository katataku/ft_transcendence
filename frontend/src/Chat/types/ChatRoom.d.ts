interface ChatRoomMember {
  chatRoomId: number
  userId: number
  ban_until?: Date
  mute_until?: Date
  isAdministrator: boolean
}

interface ChatRoomMemberPK {
  chatRoomId: number
  userId: number
}
