import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

export function getChatRoomMembersRequest(
  callback: (members: ChatRoomMember[]) => void
): void {
  axios
    .get<ChatRoomMember[]>('/chatRoomMembers')
    .then((response) => {
      callback(
        response.data.map((member) => {
          return {
            ...member,
            ban_until:
              member.ban_until != null ? new Date(member.ban_until) : undefined,
            mute_until:
              member.mute_until != null
                ? new Date(member.mute_until)
                : undefined
          }
        })
      )
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

export function createChatRoomRequest(
  requestData: ChatRoomReqDto,
  callback: () => void
): void {
  axios
    .post<ChatRoom>('/chatRoom', requestData)
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function updateChatRoomRequest(
  room: ChatRoom,
  requestData: ChatRoomReqDto,
  callback: () => void
): void {
  axios
    .post<ChatRoom>('/chatRoom/' + String(room.id), requestData)
    .then((_response) => {
      callback()
    })
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

export function chatRoomAuthRequest(
  requestData: ChatRoomAuthReqDto,
  callback: () => void
): void {
  axios
    .post('/chatRoom/auth', requestData)
    .then(() => {
      callback()
    })
    .catch((reason) => {
      // 401はパスワード認証失敗
      if (reason.response.status === 401) {
        alert('パスワードが違います。')
      } else {
        alert('エラーです！')
        console.log(reason)
      }
    })
}
