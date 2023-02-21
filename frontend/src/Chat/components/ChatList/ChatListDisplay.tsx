import { useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'

// フリー素材のアイコン。
// ただし、LICENSEで再配布が禁止されているため、publicディレクトリに保存せずに、画像URLへ直接リンクする。
// https://iconbox.fun/about/#LICENSE
const _publicIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_open_24.png'
const privateIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_24.png'

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

const DeleteRoomButton = (props: {
  room: ChatRoom
  updateChatRoomList: () => void
}): JSX.Element => {
  const handleDeleteRoom = (room: ChatRoom): void => {
    axios
      .delete('/chatRoom/' + String(room.id))
      .then((_response) => {
        props.updateChatRoomList()
      })
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
      }}
    >
      delete room
    </Button>
  )
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
            <IsPublicIcon room={room}></IsPublicIcon>
            <EnterButton user={props.user} room={room}></EnterButton>
            <DeleteRoomButton
              room={room}
              updateChatRoomList={props.updateChatRoomList}
            ></DeleteRoomButton>
          </li>
        )
      })}
    </ul>
  )
}
