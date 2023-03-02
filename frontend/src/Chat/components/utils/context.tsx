import { createContext } from 'react'

const defaultChatRoom: ChatRoom = {
  id: -1,
  name: '',
  created_by_user_id: -1,
  public_id: 'public'
}

export const ChatRoomContext = createContext<ChatRoom>(defaultChatRoom)
