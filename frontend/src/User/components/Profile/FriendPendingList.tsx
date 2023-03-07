import { useContext, useEffect, useState, type ReactElement } from 'react'
import { GlobalContext } from '../../../App'
import { getFriendPendingRequest } from '../../../utils/userAxios'

export function FriendPendingList(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [friendPendingList, setFriendPendingList] = useState<User[]>([])

  useEffect(() => {
    getFriendPendingRequest(loginUser.id, (users) => {
      setFriendPendingList(users)
    })
  }, [])
  return (
    <>
      <p>あなたに届いているフレンドリクエスト一覧</p>
      <p>件数：{friendPendingList.length}件</p>
      {friendPendingList.map((user, index) => {
        return (
          <div key={index}>
            <p>{user.name}</p>
          </div>
        )
      })}
    </>
  )
}
