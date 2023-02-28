import { useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { OwnerIcon } from '../utils/OwnerIcon'
import { BannedIcon } from '../utils/BannedIcon'
import { AdminIcon } from '../utils/AdminIcon'
import { isAdmin, isBanned, isOwner } from '../utils/userStatusUtils'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'
import { PrivateIcon } from '../utils/privateIcon'
import {
  getChatRoomMembersRequest,
  updateChatRoomMembersRequest
} from '../utils/requestUtils'
import { ProtectedIcon } from '../utils/protectedIcon'

// チャットルームに入室するためのボタンを表示する。
// roomMemberである場合、参加ボタンを表示する。
const EnterButton = (props: {
  user: User
  room: ChatRoom
  isRoomMember: boolean
  isBanned: boolean
}): JSX.Element => {
  const navigate = useNavigate()
  const room = props.room
  const user = props.user

  // roomMemberでない場合、参加ボタンを表示しない。
  if (!props.isRoomMember) return <></>

  // Banされている場合、参加ボタンを表示しない。
  if (props.isBanned) return <></>

  return (
    <Button
      onClick={() => {
        navigate('/chat', {
          state: { room: room.name, user }
        })
      }}
    >
      Enter
    </Button>
  )
}

// チャットルームに参加するためのボタンを表示する。
const JoinButton = (props: {
  user: User
  room: ChatRoom
  isRoomMember: boolean
  updateChatRoomList: () => void
}): JSX.Element => {
  const room = props.room
  const user = props.user

  // Privateルームの場合、参加ボタンを表示しない。
  if (room.public_id === 'private') return <></>

  // roomMemberの場合、参加ボタンを表示しない。
  if (props.isRoomMember) return <></>

  const handleJoinRoom = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: room.id,
      userId: user.id,
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
  user: User
  isAdmin: boolean
}): JSX.Element => {
  const room = props.room
  const user = props.user
  const navigate = useNavigate()

  // チャットルームのオーナー or 管理者でない場合、設定ボタンを表示しない。
  if (!(isOwner(user, room) || props.isAdmin)) return <></>

  return (
    <>
      <Button
        variant="outline-info"
        onClick={() => {
          navigate('/chatroom', {
            state: { room, user }
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
  user: User
  roomList: ChatRoom[]
  updateChatRoomList: () => void
}): ReactElement => {
  const [roomMembersAll, setRoomMembersAll] = useState<ChatRoomMember[]>([])
  useEffect(() => {
    getChatRoomMembersRequest(setRoomMembersAll)
  }, [props.roomList, props.user])

  return (
    <ul>
      {props.roomList.map((room, index) => {
        // チャットルームに参加しているかどうかを判断する。
        const isRoomMemberBool: boolean =
          roomMembersAll
            .filter((item) => item.chatRoomId === room.id)
            .filter((item) => item.userId === props.user.id).length > 0

        const isBannedBool: boolean = isBanned(props.user, room, roomMembersAll)
        const isAdminBool: boolean = isAdmin(props.user, room, roomMembersAll)
        const isOwnerBool: boolean = isOwner(props.user, room)

        const deleteButton: JSX.Element =
          isRoomMemberBool && !isBannedBool ? (
            <DeleteMemberButton
              room={room}
              member={props.user}
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
              user={props.user}
              room={room}
              isRoomMember={isRoomMemberBool}
              isBanned={isBannedBool}
            ></EnterButton>
            <JoinButton
              user={props.user}
              room={room}
              isRoomMember={isRoomMemberBool}
              updateChatRoomList={props.updateChatRoomList}
            ></JoinButton>
            {deleteButton}
            <SettingButton
              room={room}
              user={props.user}
              isAdmin={isAdminBool}
            ></SettingButton>
          </li>
        )
      })}
    </ul>
  )
}
