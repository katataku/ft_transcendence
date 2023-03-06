import axios from 'axios'

export function getChatBlockUserRequest(
  user: User,
  callback: (members: blockUserList[]) => void
): void {
  axios
    .get('/chat-block-user/' + String(user.id))
    .then((response) => {
      callback(response.data)
    })
    .catch(() => {
      alert('エラーです！')
    })
}

export function updateChatBlockUserRequest(
  newMuteUser: blockUserList,
  callback: () => void
): void {
  axios
    .post<blockUserList>('/chat-mute-user', newMuteUser)
    .then(callback)
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}
