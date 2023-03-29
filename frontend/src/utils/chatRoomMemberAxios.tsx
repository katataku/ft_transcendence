import jwtAxios from './axiosConfig'

export function getChatRoomMembersRequest(
  callback: (members: ChatRoomMember[]) => void
): void {
  jwtAxios
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

export function updateChatRoomMembersRequest(
  requestData: ChatRoomMember,
  callback: () => void
): void {
  jwtAxios
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
  jwtAxios
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
