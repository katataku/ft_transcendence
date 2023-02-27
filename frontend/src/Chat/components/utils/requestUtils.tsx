import axios from 'axios'

export function getChatRoomMembersRequest(
  callback: (members: ChatRoomMember[]) => void
): void {
  axios
    .get<ChatRoomMember[]>('/chatRoomMembers')
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getAllUsersRequest(callback: (users: User[]) => void): void {
  axios
    .get<User[]>('/user/users')
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getUserRequest(
  userId: number,
  callback: (user: User) => void
): void {
  axios
    .get<User>('/user/' + String(userId))
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteChatRoomRequest(room: ChatRoom): void {
  axios
    .delete('/chatRoom/' + String(room.id))
    .then((_response) => {})
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function updateChatRoomMembersRequest(
  requestData: ChatRoomMember,
  callback: () => void
): void {
  axios
    .post<ChatRoom>('/chatRoomMembers', requestData)
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteChatRoomMembersRequest(
  requestData: ChatRoomMemberPK,
  callback: () => void
): void {
  axios
    .delete<ChatRoom>('/chatRoomMembers', { data: requestData })
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
