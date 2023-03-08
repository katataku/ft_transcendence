import { type ReactElement, useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../../../App'
import {
  deleteChatBlockUserRequest,
  getChatBlockUserRequest,
  updateChatBlockUserRequest
} from '../../../utils/chatBlockUserAxios'
import { BlockIcon } from '../../../utils/Icon/BlockIcon'
import { FriendIcon } from '../../../utils/Icon/FriendIcon'
import {
  deleteFriendPendingRequest,
  getFriendPendingRequest,
  getFriendsRequest,
  getUserRequest,
  updateFriendPendingRequest
} from '../../../utils/userAxios'
import { isBlockUser } from '../../utils/userStatusUtils'

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

export function FriendInvitationButton(props: {
  targetUser: User
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [isFriend, setIsFriend] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  const updateIsFriend = (): void => {
    getFriendsRequest(loginUser.id, (friends) => {
      setIsFriend(friends.some((friend) => friend.id === props.targetUser.id))
    })
  }

  const updateIsPending = (): void => {
    getFriendPendingRequest(props.targetUser.id, (friends) => {
      setIsPending(friends.some((friend) => friend.id === loginUser.id))
    })
  }

  useEffect(() => {
    updateIsFriend()
    updateIsPending()
  }, [loginUser, props.targetUser])

  const sendFriendRequest = (): void => {
    const requestData = {
      from: loginUser.id,
      to: props.targetUser.id
    }
    updateFriendPendingRequest(requestData, () => {
      alert('フレンドリクエストを申請しました！')
      updateIsFriend()
      updateIsPending()
    })
  }

  const sendRejectRequest = (): void => {
    const requestData = {
      from: loginUser.id,
      to: props.targetUser.id
    }
    deleteFriendPendingRequest(requestData, () => {
      alert('フレンドリクエストをキャンセルしました！')
      updateIsFriend()
      updateIsPending()
    })
  }

  if (isFriend) {
    return (
      <>
        <FriendIcon isFriend={isFriend}></FriendIcon>
        <Button variant="danger" onClick={() => {}}>
          フレンドを削除ボタンになる予定
        </Button>
      </>
    )
  }
  if (isPending) {
    return (
      <>
        フレンド申請中。
        <Button variant="danger" onClick={sendRejectRequest}>
          フレンド申請をキャンセル
        </Button>
      </>
    )
  }
  return (
    <>
      <Button onClick={sendFriendRequest}>このユーザをフレンドに招待</Button>
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
        <FriendInvitationButton
          targetUser={targetUser}
        ></FriendInvitationButton>
      </p>
      <p>
        <Button>このユーザとDMを開始するボタンになる予定</Button>
      </p>
      <p>
        <BlockButton targetUser={targetUser}></BlockButton>
      </p>
    </>
  )
}
