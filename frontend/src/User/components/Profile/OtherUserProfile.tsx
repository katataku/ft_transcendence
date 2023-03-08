import { type ReactElement, useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { GlobalContext } from '../../../App'
import {
  deleteChatBlockUserRequest,
  getChatBlockUserRequest,
  updateChatBlockUserRequest
} from '../../../utils/chatBlockUserAxios'
import { updateChatDMMembersRequest } from '../../../utils/chatDMAxios'
import { getChatRoomRequest } from '../../../utils/chatRoomAxios'
import { BlockIcon } from '../../../utils/Icon/BlockIcon'
import { getUserRequest } from '../../../utils/userAxios'
import { isBlockUser } from '../../utils/userStatusUtils'

function DMButton(props: { targetUser: User }): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const navigate = useNavigate()
  const [room, setRoom] = useState<ChatRoom>()
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([])

  const updateRoom = (): void => {
    const requestData: ChatDMMembersPK = {
      user1Id: loginUser.id,
      user2Id: props.targetUser.id
    }
    updateChatDMMembersRequest(requestData, (item) => {
      chatRoomList
        .filter((room) => room.id === item.chatRoomId)
        .forEach((room) => {
          setRoom(room)
        })
    })
  }
  useEffect(() => {
    updateRoom()
  }, [chatRoomList])

  useEffect(() => {
    getChatRoomRequest(setChatRoomList)
  }, [])

  const handleOnClick = (): void => {
    navigate('/chat', {
      state: { room }
    })
  }

  return <Button onClick={handleOnClick}>このユーザとDMを開始</Button>
}

function BlockButton(props: { targetUser: User }): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [blockUserList, setBlockUserList] = useState<blockUserList[]>([])
  const [isBlocked, setIsBlocked] = useState<boolean>(false)

  const updateIsBlocked = (): void => {
    getChatBlockUserRequest(loginUser, setBlockUserList)
  }

  useEffect(() => {
    setIsBlocked(isBlockUser(props.targetUser, blockUserList))
  }, [blockUserList])

  useEffect(() => {
    updateIsBlocked()
  }, [loginUser])

  return isBlocked ? (
    <>
      <BlockIcon isBlocked={isBlocked}></BlockIcon>
      <Button
        onClick={() => {
          const deleteBlockUser: blockUserListPK = {
            blockUserId: loginUser.id,
            blockedUserId: props.targetUser.id
          }
          deleteChatBlockUserRequest(deleteBlockUser, updateIsBlocked)
        }}
      >
        ブロック解除
      </Button>
    </>
  ) : (
    <>
      <Button
        variant="outline-danger"
        onClick={() => {
          const newBlockUser: blockUserList = {
            blockUserId: loginUser.id,
            blockedUserId: props.targetUser.id,
            block_until: new Date(2023, 12, 31, 23, 59, 0)
          }
          updateChatBlockUserRequest(newBlockUser, updateIsBlocked)
        }}
      >
        このユーザをブロック
      </Button>
    </>
  )
}

export function OtherUserProfile(): ReactElement {
  const { id } = useParams()

  const [targetUser, setTargetUser] = useState<User>()

  useEffect(() => {
    getUserRequest(Number(id), (user) => {
      setTargetUser(user)
    })
  }, [])
  if (targetUser == null) return <></>
  return (
    <>
      <h2>Other User Profile</h2>
      <p>ID : {targetUser.id}</p>
      <p>NAME: {targetUser.name}</p>
      <p>ここにプロフィール画像を表示する</p>
      <p>Gameの成績・Match Historyを表示する</p>
      <p>current statusを表示する(online, offline, in a game,など).</p>

      <p>
        <Button>このユーザをフレンドに招待するボタンになる予定</Button>
      </p>
      <p>
        <DMButton targetUser={targetUser}></DMButton>
      </p>
      <p>
        <BlockButton targetUser={targetUser}></BlockButton>
      </p>
    </>
  )
}
