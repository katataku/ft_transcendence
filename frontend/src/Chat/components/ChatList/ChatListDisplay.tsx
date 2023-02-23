import { useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactElement } from 'react'
import { Badge, Button } from 'react-bootstrap'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// フリー素材のアイコン。
// ただし、LICENSEで再配布が禁止されているため、publicディレクトリに保存せずに、画像URLへ直接リンクする。
// https://iconbox.fun/about/#LICENSE
const _publicIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_open_24.png'
const privateIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_24.png'

// チャットルームのオーナーを示すアイコンを表示する。
const OwnerIcon = (props: { room: ChatRoom; user: User }): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.user.id
  const icon: JSX.Element = isOwner ? (
    <>
      <Badge pill bg="info">
        owner
      </Badge>{' '}
    </>
  ) : (
    <></>
  )
  return icon
}

const IsPublicIcon = (props: { room: ChatRoom }): JSX.Element => {
  const isPublicIcon = props.room.is_public ? (
    <></>
  ) : (
    <img src={privateIconURL} alt="new" width="20" height="20" />
  )
  return isPublicIcon
}

// チャットルームに入室するためのボタンを表示する。
// roomMembersが空でない場合、参加ボタンを表示する。
const EnterButton = (props: {
  user: User
  room: ChatRoom
  roomMembers: ChatRoomMember[]
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

  return props.roomMembers.length > 0 ? enterButtonElement : <></>
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
      isBanned: false
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

  return props.roomMembers.length === 0 ? joinButtonElement : <></>
}

// チャットルームのオーナーのみ、チャットルームの設定を変更できる。
// そのため、チャットルームのオーナーのみ、設定ボタンを表示する。
// また、チャットルームのオーナーのみ、チャットルームを削除できる。
// そのため、設定画面に削除ボタンを表示する。
const SettingButton = (props: { room: ChatRoom; user: User }): JSX.Element => {
  const room = props.room
  const user = props.user
  const navigate = useNavigate()

  const isOwner: boolean = room.created_by_user_id === user.id
  const icon: JSX.Element = isOwner ? (
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
        const roomMembers: ChatRoomMember[] = roomMembersAll
          .filter((item) => item.chatRoomId === room.id)
          .filter((item) => item.userId === props.user.id)
        return (
          <li key={index}>
            {room.name}
            <OwnerIcon room={room} user={props.user}></OwnerIcon>
            <IsPublicIcon room={room}></IsPublicIcon>
            <EnterButton
              user={props.user}
              room={room}
              roomMembers={roomMembers}
            ></EnterButton>
            <JoinButton
              user={props.user}
              room={room}
              roomMembers={roomMembers}
              updateChatRoomList={props.updateChatRoomList}
            ></JoinButton>
            <SettingButton room={room} user={props.user}></SettingButton>
          </li>
        )
      })}
    </ul>
  )
}
