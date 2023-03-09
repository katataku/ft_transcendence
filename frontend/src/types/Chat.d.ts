interface ChatState {
  room: ChatRoom
}

interface ChatListState {
  kicked: boolean
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
