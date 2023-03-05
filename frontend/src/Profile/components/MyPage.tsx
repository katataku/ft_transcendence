import { type ReactElement, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { GlobalContext } from '../../App'

export function MyPage(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  return (
    <>
      <h2>My page</h2>
      <p>ID : {loginUser.id}</p>
      <p>NAME: {loginUser.name}</p>
      <p>ここにプロフィール画像を表示する</p>
      <p>Gameの成績・Match Historyを表示する</p>

      <p>
        <Button>自分のプロフィールを編集できるボタンになる予定</Button>
      </p>
      <p>
        <Button>2FAを有効・無効にするボタンになる予定</Button>
      </p>
    </>
  )
}
