import { useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import { Badge, Button } from 'react-bootstrap'

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

const EnterButton = (props: { user: User; room: ChatRoom }): JSX.Element => {
  const navigate = useNavigate()
  const room = props.room
  const user = props.user

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
        variant="info"
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

export const ChatListDisplay = (props: {
  user: User
  roomList: ChatRoom[]
  updateChatRoomList: () => void
}): ReactElement => {
  return (
    <ul>
      {props.roomList.map((room, index) => {
        return (
          <li key={index}>
            {room.name}
            <OwnerIcon room={room} user={props.user}></OwnerIcon>
            <IsPublicIcon room={room}></IsPublicIcon>
            <EnterButton user={props.user} room={room}></EnterButton>
            <SettingButton room={room} user={props.user}></SettingButton>
          </li>
        )
      })}
    </ul>
  )
}
