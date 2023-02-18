import * as React from 'react'
import '../../assets/styles.css'
import { useLocation } from 'react-router-dom'
import { useEffect, type ReactElement } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { ChatListDisplay } from './ChatListDisplay'
import { CreateRoomButton } from './CreateRoomButton'
import { GetUser } from './GetUser'
import { AlertElement } from './AlertElement'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// roomListの管理が責務。
// 更新のための関数をこちらで定義し、各モジュールで使用する。
export function ChatList(): ReactElement {
  const [user, setUser] = React.useState<User>({ id: 0, name: '' })
  const [roomList, setRoomList] = React.useState<ChatRoom[]>([])

  const { kicked }: ChatListState = useLocation().state

  const updateChatRoomList = (): void => {
    axios
      .get<ChatRoom[]>('/chatRoom')
      .then((response) => {
        setRoomList(response.data.map((value: ChatRoom) => value))
      })
      .catch(() => {
        alert('エラーです！')
      })
  }

  useEffect(() => {
    updateChatRoomList()
  }, [])

  return (
    <>
      <AlertElement kicked={kicked}></AlertElement>
      <div className="Chat">
        <GetUser setUser={setUser}></GetUser>
        <ChatListDisplay
          user={user}
          roomList={roomList}
          updateChatRoomList={updateChatRoomList}
        ></ChatListDisplay>
        <CreateRoomButton
          user={user}
          updateChatRoomList={updateChatRoomList}
        ></CreateRoomButton>
      </div>
    </>
  )
}
