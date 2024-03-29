import jwtAxios from './axiosConfig'

export function getChatBlockUserRequest(
  user: User,
  callback: (members: blockUserList[]) => void
): void {
  jwtAxios
    .get('/chat-block-user/' + String(user.id))
    .then((response) => {
      callback(response.data)
    })
    .catch(() => {
      alert('エラーです！')
    })
}

export function updateChatBlockUserRequest(
  newBlockUser: blockUserList,
  callback: () => void
): void {
  jwtAxios
    .post<blockUserList>('/chat-block-user', newBlockUser)
    .then(callback)
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteChatBlockUserRequest(
  deleteBlockUser: blockUserListPK,
  callback: () => void
): void {
  jwtAxios
    .delete('/chat-block-user', { data: deleteBlockUser })
    .then((_response) => {
      // 100ms後に更新する
      // 削除した直後に更新すると、削除したユーザーが表示されてしまうため。。。
      setTimeout(callback, 100)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}
