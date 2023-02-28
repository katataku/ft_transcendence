import { useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddUserButton } from './AddUserButton'
import {
  deleteChatRoomRequest,
  getChatRoomMembersRequest
} from '../utils/requestUtils'
import { UserListDisplay } from './UserListDisplay'
import { isOwner } from '../utils/userStatusUtils'
import { UpdateRoomButton } from './UpdateRoomButton'

const DeleteRoomButton = (props: {
  user: User
  room: ChatRoom
}): JSX.Element => {
  const navigate = useNavigate()
  const chatListState: ChatListState = { kicked: false }
  if (!isOwner(props.user, props.room)) return <></>

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        deleteChatRoomRequest(props.room)
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
    <>
      ChatRoom: {room.name}
      <UserListDisplay
        user={user}
        room={room}
        chatRoomMemberList={chatRoomMembersList}
        updateMemberList={updateChatRoomMembersList}
      ></UserListDisplay>
      <AddUserButton
        room={room}
        chatRoomMemberList={chatRoomMembersList}
        updateMemberList={updateChatRoomMembersList}
      ></AddUserButton>
      <UpdateRoomButton
        user={user}
        room={room}
        updateMemberList={updateChatRoomMembersList}
      ></UpdateRoomButton>
      <DeleteRoomButton user={user} room={room}></DeleteRoomButton>
    </>
  )
}
