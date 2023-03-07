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

interface blockUserList {
  blockUserId: number
  blockedUserId: number
  block_until: Date
}

interface blockUserListPK {
  blockUserId: number
  blockedUserId: number
}
