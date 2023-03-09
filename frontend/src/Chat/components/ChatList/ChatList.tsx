import * as React from 'react'
import '../../assets/styles.css'
import { useLocation } from 'react-router-dom'
import { useEffect, type ReactElement } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ChatListDisplay } from './ChatListDisplay'
import { CreateRoomButton } from './CreateRoomButton'
import { AlertElement } from './AlertElement'
import { getChatRoomRequest } from '../../../utils/chatRoomAxios'

// roomListの管理が責務。
// 更新のための関数をこちらで定義し、各モジュールで使用する。
export function ChatList(): ReactElement {
  const [roomList, setRoomList] = React.useState<ChatRoom[]>([])

  const { kicked }: ChatListState = useLocation().state

  const updateChatRoomList = (): void => {
    // ここでroomListを更新する。
    // DMは表示しない。
    getChatRoomRequest((data) => {
      setRoomList(data.filter((value: ChatRoom) => value.public_id !== 'DM'))
    })
  }

  useEffect(() => {
    updateChatRoomList()
  }, [])

  return (
    <>
      <AlertElement kicked={kicked}></AlertElement>
      <div className="Chat">
        <ChatListDisplay
          roomList={roomList}
          updateChatRoomList={updateChatRoomList}
        ></ChatListDisplay>
        <CreateRoomButton
          updateChatRoomList={updateChatRoomList}
        ></CreateRoomButton>
      </div>
    </>
  )
}
