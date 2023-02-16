interface ChatState {
  user: User
  room: string
}

interface ChatListState {
  kicked: boolean
}

interface User {
  id: number
  name: string
}
