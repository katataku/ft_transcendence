import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

export function getChatRoomRequest(
  callback: (value: ChatRoom[]) => void
): void {
  axios
    .get<ChatRoom[]>('/chatRoom')
    .then((response) => {
      callback(response.data)
    })
    .catch(() => {
      alert('エラーです！')
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

export function chatRoomAuthRequest(
  room: ChatRoom,
  requestData: ChatRoomAuthReqDto,
  callback: () => void
): void {
  axios
    .post('/chatRoom/' + String(room.id) + '/auth', requestData)
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
