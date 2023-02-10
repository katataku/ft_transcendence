interface messageEventType {
  key: number
  name: string
  room: string
  msg: string
}

interface banEventType {
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
}
