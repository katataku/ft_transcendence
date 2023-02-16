interface messageEventType {
  key: number
  user: User
  room: string
  msg: string
}

interface kickEventType {
  key: number
  userId: number
  room: string
}

interface messageItem {
  user: User
  body: JSX.Element
}

interface muteUserList {
  muteUserId: number
  mutedUserId: number
  mute_until: Date
}
