interface ChatState {
  room: ChatRoom
}

interface ChatRoomState {
  room: ChatRoom
}

interface ChatDMMembers {
  user1Id: number
  user2Id: number
  chatRoomId: number
}

interface ChatDMMembersPK {
  user1Id: number
  user2Id: number
}
