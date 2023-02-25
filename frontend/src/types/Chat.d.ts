interface ChatState {
  user: User
  room: string
}

interface ChatListState {
  kicked: boolean
}

interface ChatRoomState {
  room: ChatRoom
}
