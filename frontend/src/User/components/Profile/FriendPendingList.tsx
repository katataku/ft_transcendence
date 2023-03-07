import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import {
  deleteFriendPendingRequest,
  getFriendPendingRequest,
  updateFriendPendingRequest
} from '../../../utils/userAxios'

function AcceptButton(props: {
  targetUserId: number
  updateFriendPendingList: () => void
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)

  const acceptFriendRequest = (): void => {
    const requestData = {
      from: loginUser.id,
      to: props.targetUserId
    }
    updateFriendPendingRequest(requestData, () => {
      alert('フレンドリクエストを承認しました！')
      props.updateFriendPendingList()
    })
  }

  return <Button onClick={acceptFriendRequest}>承認</Button>
}

function RejectButton(props: {
  targetUserId: number
  updateFriendPendingList: () => void
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)

  const rejectRequest = (): void => {
    const requestData = {
      from: props.targetUserId,
      to: loginUser.id
    }
    deleteFriendPendingRequest(requestData, () => {
      alert('フレンドリクエストを拒否しました！')
      props.updateFriendPendingList()
    })
  }

  return (
    <Button variant="danger" onClick={rejectRequest}>
      拒否
    </Button>
  )
}
export function FriendPendingList(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [friendPendingList, setFriendPendingList] = useState<User[]>([])

  const updateFriendPendingList = (): void => {
    getFriendPendingRequest(loginUser.id, (users) => {
      setFriendPendingList(users)
    })
  }

  useEffect(() => {
    updateFriendPendingList()
  }, [])
  return (
    <>
      <p>あなたに届いているフレンドリクエスト一覧</p>
      <p>件数：{friendPendingList.length}件</p>
      {friendPendingList.map((user, index) => {
        return (
          <div key={index}>
            <p>
              {user.name}
              <AcceptButton
                targetUserId={user.id}
                updateFriendPendingList={updateFriendPendingList}
              />
              <RejectButton
                targetUserId={user.id}
                updateFriendPendingList={updateFriendPendingList}
              />
            </p>
          </div>
        )
      })}
    </>
  )
}
