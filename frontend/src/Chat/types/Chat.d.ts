interface messageEventType {
  key: number
  name: string
  room: string
  msg: string
}

interface kickEventType {
  key: number
  name: string
  room: string
}

interface messageItem {
  name: string
  body: JSX.Element
}

interface muteUserList {
  muteUserId: string
  mutedUserId: string
  mute_until: Date
}
