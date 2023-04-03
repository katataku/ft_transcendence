import { type ReactElement, useState, useEffect, useContext } from 'react'
import { Button, Image } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { GlobalContext } from '../../../App'
import {
  deleteChatBlockUserRequest,
  getChatBlockUserRequest,
  updateChatBlockUserRequest
} from '../../../utils/chatBlockUserAxios'
import { updateChatDMMembersRequest } from '../../../utils/chatDMAxios'
import { getChatRoomIdRequest } from '../../../utils/chatRoomAxios'
import { BlockIcon } from '../../../utils/Icon/BlockIcon'
import { FriendIcon } from '../../../utils/Icon/FriendIcon'
import {
  deleteFriendPendingRequest,
  deleteFriendRequest,
  getFriendPendingRequest,
  getFriendsRequest,
  getMatchHistoryById,
  getUserRequest,
  updateFriendPendingRequest
} from '../../../utils/userAxios'
import { isBlockUser } from '../../utils/userStatusUtils'
import { BaseURL } from '../../../constants'
import { MatchHistory } from '../../../components/MatchHistory'

function DMButton(props: { targetUser: User }): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const navigate = useNavigate()

  const handleOnClick = (): void => {
    const requestData: ChatDMMembersPK = {
      user1Id: loginUser.id,
      user2Id: props.targetUser.id
    }

    updateChatDMMembersRequest(requestData, (DMMemberItem) => {
      getChatRoomIdRequest(DMMemberItem.chatRoomId, (room: ChatRoom) => {
        navigate('/chat', {
          state: { room }
        })
      })
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
    deleteFriendPendingRequest(loginUser.id, props.targetUser.id, () => {
      alert('フレンドリクエストをキャンセルしました！')
      updateIsFriend()
      updateIsPending()
    })
  }

  const sendFriendDeleteRequest = (): void => {
    deleteFriendRequest(loginUser.id, props.targetUser.id, () => {
      alert('フレンドを削除しました！')
      updateIsFriend()
      updateIsPending()
    })
  }

  if (isFriend) {
    return (
      <>
        <FriendIcon isFriend={isFriend}></FriendIcon>
        <Button variant="danger" onClick={sendFriendDeleteRequest}>
          フレンドを削除
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
  const [matchHist, setMatchHist] = useState({ wins: 0, losses: 0 })

  useEffect(() => {
    getUserRequest(Number(id), (user) => {
      setTargetUser(user)
      getMatchHistoryById(user.id, setMatchHist)
    })
  }, [])
  if (targetUser == null) return <></>
  return (
    <>
      <h2>Other User Profile</h2>
      <p>ID : {targetUser.id}</p>
      <p>NAME: {targetUser.name}</p>
      <p>
        <Image
          src={`${BaseURL}/user/user_avatar/${targetUser.id}`}
          style={{ borderRadius: '50%', margin: '30px' }}
          height={300}
        />
      </p>
      <MatchHistory matchHistory={matchHist} />
      {targetUser.isOnline === true ? (
        <p style={{ color: 'green' }}>ONLINE</p>
      ) : (
        <p style={{ color: 'red' }}>OFFLINE</p>
      )}

      <p>
        <FriendInvitationButton
          targetUser={targetUser}
        ></FriendInvitationButton>
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
