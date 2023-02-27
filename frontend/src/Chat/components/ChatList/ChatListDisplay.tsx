import { useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { OwnerIcon } from '../utils/OwnerIcon'
import { BannedIcon } from '../utils/BannedIcon'
import { AdminIcon } from '../utils/AdminIcon'
import { isAdmin, isBanned, isOwner } from '../utils/userStatusUtils'
import { DeleteMemberButton } from '../utils/DeleteMemberButton'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// フリー素材のアイコン。
// ただし、LICENSEで再配布が禁止されているため、publicディレクトリに保存せずに、画像URLへ直接リンクする。
// https://iconbox.fun/about/#LICENSE
const _publicIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_open_24.png'
const privateIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_24.png'

const PrivateIcon = (props: { room: ChatRoom }): JSX.Element => {
  const isPublicIcon =
    props.room.public_id === 2 ? (
      <img src={privateIconURL} alt="new" width="20" height="20" />
    ) : (
      <></>
    )

  return isPublicIcon
}

// チャットルームに入室するためのボタンを表示する。
// roomMembersが空でない場合、参加ボタンを表示する。
const EnterButton = (props: {
  user: User
  room: ChatRoom
  roomMembers: ChatRoomMember[]
  isBanned: boolean
}): JSX.Element => {
  const navigate = useNavigate()
  const room = props.room
  const user = props.user

  const enterButtonElement: JSX.Element = (
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

  const isShow: boolean = props.roomMembers.length > 0 && !props.isBanned

  return isShow ? enterButtonElement : <></>
}

// チャットルームに参加するためのボタンを表示する。
// roomMembersが空の場合、参加ボタンを表示する。
const JoinButton = (props: {
  user: User
  room: ChatRoom
  roomMembers: ChatRoomMember[]
  updateChatRoomList: () => void
}): JSX.Element => {
  const room = props.room
  const user = props.user

  const handleJoinRoom = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: room.id,
      userId: user.id,
      isBanned: false,
      isAdministrator: false
    }
    axios
      .post<ChatRoom>('/chatRoomMembers', requestData)
      .then((_response) => {
        props.updateChatRoomList()
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  const joinButtonElement: JSX.Element = (
    <Button variant="outline-primary" onClick={handleJoinRoom}>
      Join
    </Button>
  )

  const isShow: boolean = props.roomMembers.length === 0 && room.public_id === 1

  return isShow ? joinButtonElement : <></>
}

// チャットルームのオーナーのみ、チャットルームの設定を変更できる。
// そのため、チャットルームのオーナーのみ、設定ボタンを表示する。
// また、チャットルームのオーナーのみ、チャットルームを削除できる。
// そのため、設定画面に削除ボタンを表示する。
const SettingButton = (props: {
  room: ChatRoom
  user: User
  isAdmin: boolean
}): JSX.Element => {
  const room = props.room
  const user = props.user
  const navigate = useNavigate()

  const isShow = isOwner(user, room) || props.isAdmin
  const icon: JSX.Element = isShow ? (
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
  ) : (
    <></>
  )
  return icon
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
    axios
      .get<ChatRoomMember[]>('/chatRoomMembers')
      .then((response) => {
        setRoomMembersAll(response.data)
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }, [props.roomList, props.user])

  return (
    <ul>
      {props.roomList.map((room, index) => {
        // チャットルームに参加しているかどうかを判断する。
        // 参加している場合、参加しているユーザーの情報を取得する。
        // 参加していない場合、空の配列を取得する。
        const roomMembers: ChatRoomMember[] = roomMembersAll
          .filter((item) => item.chatRoomId === room.id)
          .filter((item) => item.userId === props.user.id)

        const isRoomMemberBool: boolean = roomMembers.length > 0
        const isBannedBool: boolean = isBanned(props.user, room, roomMembersAll)
        const isAdminBool: boolean = isAdmin(props.user, room, roomMembersAll)

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
            <BannedIcon isBanned={isBannedBool}></BannedIcon>
            <OwnerIcon room={room} user={props.user}></OwnerIcon>
            <AdminIcon isAdmin={isAdminBool}></AdminIcon>
            <PrivateIcon room={room}></PrivateIcon>
            <EnterButton
              user={props.user}
              room={room}
              roomMembers={roomMembers}
              isBanned={isBannedBool}
            ></EnterButton>
            <JoinButton
              user={props.user}
              room={room}
              roomMembers={roomMembers}
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
