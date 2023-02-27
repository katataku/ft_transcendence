import { useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddUserButton } from './AddUserButton'
import {
  deleteChatRoomRequest,
  getChatRoomMembersRequest,
  getUserRequest
} from '../utils/requestUtils'
import { UserListDisplay } from './UserListDisplay'
import { isOwner } from '../utils/userStatusUtils'

const DeleteRoomButton = (props: { room: ChatRoom }): JSX.Element => {
  const navigate = useNavigate()
  const chatListState: ChatListState = { kicked: false }

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
  const [userList, setUserList] = useState<User[]>([])

  const openAsOwner: boolean = isOwner(user, room)

  // チャットルームに所属しているユーザーのリストを取得する。
  const updateMemberList = (): void => {
    setUserList([])
    chatRoomMembersList.map(async (value: ChatRoomMember) => {
      getUserRequest(value.userId, (data) => {
        setUserList(
          (userList) =>
            [...userList, data]
              .sort((a, b) => a.id - b.id)
              .filter(
                (element, index, arr) =>
                  arr.map((value) => value.id).indexOf(element.id) === index
              ) // 重複削除
        )
      })
    })
  }

  // chatRoomMembersListを更新する。
  const updateChatRoomMembersList = (): void => {
    setChatRoomMembersList([])
    getChatRoomMembersRequest((data) => {
      setChatRoomMembersList(
        data.filter((value) => value.chatRoomId === room.id)
      )
    })
  }

  useEffect(() => {
    updateMemberList()
  }, [chatRoomMembersList])

  useEffect(() => {
    updateChatRoomMembersList()
  }, [])

  return (
    <>
      ChatRoom: {room.name}
      <UserListDisplay
        room={room}
        userList={userList}
        chatRoomMemberList={chatRoomMembersList}
        updateMemberList={updateChatRoomMembersList}
        openAsOwner={openAsOwner}
      ></UserListDisplay>
      <AddUserButton
        room={room}
        updateMemberList={updateChatRoomMembersList}
        userList={userList}
      ></AddUserButton>
      <DeleteRoomButton room={room}></DeleteRoomButton>
    </>
  )
}
