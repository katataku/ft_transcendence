import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddUserButton } from './AddUserButton'
import { deleteChatRoomRequest } from '../../../utils/chatRoomAxios'
import { getChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { UserListDisplay } from './UserListDisplay'
import { isOwner } from '../utils/userStatusUtils'
import { UpdateRoomButton } from './UpdateRoomButton'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'

const DeleteRoomButton = (props: { user: User }): JSX.Element => {
  const navigate = useNavigate()
  const chatListState: ChatListState = { kicked: false }
  const room = useContext(ChatRoomContext)
  if (!isOwner(props.user, room)) return <></>

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        deleteChatRoomRequest(room)
        // 100ms後に更新する
        // 削除した直後に更新すると、削除したルームが表示されてしまうため。。。
        setTimeout(() => {
          navigate('/chatlist', {
            state: { chatListState }
          })
        }, 100)
      }}
    >
      delete room
    </Button>
  )
}

// チャットルームに所属しているユーザーのリストを管理する。
export function ChatRoom(): ReactElement {
  const { room, user } = useLocation().state
  const [chatRoomMembersList, setChatRoomMembersList] = useState<
    ChatRoomMember[]
  >([])

  // chatRoomMembersListを更新する。
  const updateChatRoomMembersList = (): void => {
    setChatRoomMembersList([])
    getChatRoomMembersRequest((data) => {
      setChatRoomMembersList(
        data
          .filter((value) => value.chatRoomId === room.id)
          .sort((a, b) => a.userId - b.userId)
      )
    })
  }

  useEffect(() => {
    updateChatRoomMembersList()
  }, [])

  return (
    <ChatRoomContext.Provider value={room}>
      <ChatRoomRefreshContext.Provider value={updateChatRoomMembersList}>
        ChatRoom: {room.name}
        <UserListDisplay
          user={user}
          chatRoomMemberList={chatRoomMembersList}
        ></UserListDisplay>
        <AddUserButton chatRoomMemberList={chatRoomMembersList}></AddUserButton>
        <UpdateRoomButton user={user}></UpdateRoomButton>
        <DeleteRoomButton user={user}></DeleteRoomButton>
      </ChatRoomRefreshContext.Provider>
    </ChatRoomContext.Provider>
  )
}
