import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { OwnerIcon } from '../utils/Icon/OwnerIcon'
import { BannedIcon } from '../utils/Icon/BannedIcon'
import { AdminIcon } from '../utils/Icon/AdminIcon'
import {
  isAdmin,
  isBanned,
  isLoginUserOwner,
  isOwner
} from '../utils/userStatusUtils'
import { DeleteMemberButton } from '../utils/Button/DeleteMemberButton'
import { PrivateIcon } from '../utils/Icon/privateIcon'
import {
  getChatRoomMembersRequest,
  updateChatRoomMembersRequest
} from '../../../utils/chatRoomMemberAxios'
import { ProtectedIcon } from '../utils/Icon/protectedIcon'
import { EnterButton } from './EnterButton'
import { GlobalContext } from '../../../App'

// チャットルームに参加するためのボタンを表示する。
const JoinButton = (props: {
  room: ChatRoom
  isRoomMember: boolean
  updateChatRoomList: () => void
}): JSX.Element => {
  const room = props.room
  const { loginUser } = useContext(GlobalContext)

  // Privateルームの場合、参加ボタンを表示しない。
  if (room.public_id === 'private') return <></>

  // roomMemberの場合、参加ボタンを表示しない。
  if (props.isRoomMember) return <></>

  const handleJoinRoom = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: room.id,
      userId: loginUser.id,
      isAdministrator: false
    }
    updateChatRoomMembersRequest(requestData, props.updateChatRoomList)
  }

  return (
    <Button variant="outline-primary" onClick={handleJoinRoom}>
      Join
    </Button>
  )
}

// チャットルームの設定ボタンを表示する。
const SettingButton = (props: {
  room: ChatRoom
  isAdmin: boolean
}): JSX.Element => {
  const room = props.room
  const navigate = useNavigate()

  // チャットルームのオーナー or 管理者でない場合、設定ボタンを表示しない。
  if (!(isLoginUserOwner(room) || props.isAdmin)) return <></>

  return (
    <>
      <Button
        variant="outline-info"
        onClick={() => {
          navigate('/chatroom', {
            state: { room }
          })
        }}
      >
        settings
      </Button>
    </>
  )
}

// チャットルームの一覧を表示する。
// chatRoomMemberの情報を取得する。
// 取得した情報をモジュール渡し、各コンポーネントにて出力の判断を行う。
export const ChatListDisplay = (props: {
  roomList: ChatRoom[]
  updateChatRoomList: () => void
}): ReactElement => {
  const { loginUser } = useContext(GlobalContext)
  const [roomMembersAll, setRoomMembersAll] = useState<ChatRoomMember[]>([])
  useEffect(() => {
    getChatRoomMembersRequest(setRoomMembersAll)
  }, [props.roomList, loginUser])

  return (
    <ul>
      {props.roomList.map((room, index) => {
        // チャットルームに参加しているかどうかを判断する。
        const isRoomMemberBool: boolean =
          roomMembersAll
            .filter((item) => item.chatRoomId === room.id)
            .filter((item) => item.userId === loginUser.id).length > 0

        const isBannedBool: boolean = isBanned(loginUser, room, roomMembersAll)
        const isAdminBool: boolean = isAdmin(loginUser, room, roomMembersAll)
        const isOwnerBool: boolean = isOwner(loginUser, room)

        const deleteButton: JSX.Element =
          isRoomMemberBool && !isBannedBool ? (
            <DeleteMemberButton
              room={room}
              member={loginUser}
              onClickCallback={props.updateChatRoomList}
              msg={'Leave from the room'}
            ></DeleteMemberButton>
          ) : (
            <></>
          )

        return (
          <li key={index}>
            {room.name}
            <PrivateIcon isPrivate={room.public_id === 'private'}></PrivateIcon>
            <ProtectedIcon
              isProtected={room.public_id === 'protected'}
            ></ProtectedIcon>
            <OwnerIcon isOwner={isOwnerBool}></OwnerIcon>
            <AdminIcon isAdmin={isAdminBool}></AdminIcon>
            <BannedIcon isBanned={isBannedBool}></BannedIcon>
            <EnterButton
              room={room}
              isRoomMember={isRoomMemberBool}
              isBanned={isBannedBool}
            ></EnterButton>
            <JoinButton
              room={room}
              isRoomMember={isRoomMemberBool}
              updateChatRoomList={props.updateChatRoomList}
            ></JoinButton>
            {deleteButton}
            <SettingButton room={room} isAdmin={isAdminBool}></SettingButton>
          </li>
        )
      })}
    </ul>
  )
}
