import jwtAxios from './axiosConfig'

export function getChatRoomRequest(
  callback: (value: ChatRoom[]) => void
): void {
  jwtAxios
    .get<ChatRoom[]>('/chatRoom')
    .then((response) => {
      callback(response.data)
    })
    .catch(() => {
      alert('エラーです！')
    })
}

export function getChatRoomIdRequest(
  roomId: number,
  callback: (value: ChatRoom) => void
): void {
  jwtAxios
    .get<ChatRoom[]>('/chatRoom')
    .then((response) => {
      response.data
        .filter((room) => room.id === roomId)
        .forEach((room) => {
          callback(room)
        })
    })
    .catch(() => {
      alert('エラーです！')
    })
}

export function deleteChatRoomRequest(room: ChatRoom): void {
  jwtAxios
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
  jwtAxios
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
  jwtAxios
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
  jwtAxios
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

export function updateChatRoomOwnerRequest(
  room: ChatRoom,
  newOwner: { id: number }
): void {
  jwtAxios
    .post('/chatRoom/' + String(room.id) + '/updateOwner', newOwner)
    .then((_response) => {})
    .catch((reason) => {
      alert('エラーです!')
      console.log(reason)
    })
}
