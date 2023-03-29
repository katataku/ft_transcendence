import jwtAxios from './axiosConfig'

export function updateChatDMMembersRequest(
  requestData: ChatDMMembersPK,
  callback: (chatDMMembers: ChatDMMembers) => void
): void {
  jwtAxios
    .post<ChatDMMembers>('/chatDMMembers', requestData)
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}
