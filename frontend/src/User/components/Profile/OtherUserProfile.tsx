import { type ReactElement, useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getUserRequest } from '../../../utils/userAxios'

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
        <Button>このユーザとDMを開始するボタンになる予定</Button>
      </p>
      <p>
        <Button>このユーザをブロックするボタンになる予定</Button>
      </p>
    </>
  )
}
