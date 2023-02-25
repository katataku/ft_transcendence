import axios from 'axios'
import { useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddUserButton } from './AddUserButton'
import { UserListDisplay } from './UserListDisplay'

const DeleteRoomButton = (props: { room: ChatRoom }): JSX.Element => {
  const navigate = useNavigate()
  const chatListState: ChatListState = { kicked: false }
  const handleDeleteRoom = (room: ChatRoom): void => {
    axios
      .delete('/chatRoom/' + String(room.id))
      .then((_response) => {})
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        handleDeleteRoom(props.room)
        navigate('/chatlist', {
          state: { chatListState }
        })
      }}
    >
      delete room
    </Button>
  )
}

// チャットルームに所属しているユーザーのリストを管理する。
export function ChatRoom(): ReactElement {
  const { room } = useLocation().state
  const [userList, setUserList] = useState<User[]>([])

  // チャットルームに所属しているユーザーのリストを取得する。
  const updateMemberList = (): void => {
    setUserList([])
    axios
      .get<ChatRoomMember[]>('/chatRoomMembers')
      .then((response) => {
        response.data.map(async (value: ChatRoomMember) => {
          const requestPath = '/user/' + String(value.userId)
          await axios
            .get<User>(requestPath)
            .then((response) => {
              setUserList(
                (userList) =>
                  [...userList, response.data].filter(
                    (element, index, arr) =>
                      arr.map((value) => value.id).indexOf(element.id) === index
                  ) // 重複削除
              )
            })
            .catch(() => {
              alert(requestPath + ' リクエストエラーです！')
            })
        })
      })
      .catch(() => {
        alert('/chatRoomMembers リクエストエラーです！')
      })
  }

  useEffect(() => {
    updateMemberList()
  }, [])

  return (
    <>
      ChatRoom: {room.name}
      <UserListDisplay userList={userList}></UserListDisplay>
      <AddUserButton updateMemberList={updateMemberList}></AddUserButton>
      <DeleteRoomButton room={room}></DeleteRoomButton>
    </>
  )
}
