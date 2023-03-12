import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { GlobalContext } from '../../../App'
import { getFriendRequest } from '../../../utils/userAxios'

export function FriendList(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [friendList, setFriendList] = useState<User[]>([])

  const updateFriendList = (): void => {
    getFriendRequest(loginUser.id, (users) => {
      setFriendList(users)
    })
  }

  useEffect(() => {
    updateFriendList()
  }, [])
  return (
    <>
      <p>あなたのフレンド一覧</p>
      <p>人数：{friendList.length}人</p>
      {friendList.map((user, index) => {
        return (
          <div key={index}>
            <p>
              <Link to={'/profile/' + String(user.id)}>{user.name}</Link>
            </p>
          </div>
        )
      })}
    </>
  )
}
