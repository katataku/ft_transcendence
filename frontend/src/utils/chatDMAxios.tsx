import axios from 'axios'

export function updateChatDMMembersRequest(
  requestData: ChatDMMembersPK,
  callback: (chatDMMembers: ChatDMMembers) => void
): void {
  axios
    .post<ChatDMMembers>('/chatDMMembers', requestData)
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}
