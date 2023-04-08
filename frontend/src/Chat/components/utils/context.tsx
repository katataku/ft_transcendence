import { createContext } from 'react'

const defaultChatRoom: ChatRoom = {
  id: -1,
  name: '',
  owner_id: -1,
  public_id: 'public'
}

export const ChatRoomContext = createContext<ChatRoom>(defaultChatRoom)

export const ChatRoomRefreshContext = createContext<() => void>(() => {})
