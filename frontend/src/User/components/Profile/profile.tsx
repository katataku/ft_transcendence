import { useContext, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../../../App'
import { MyPage } from './MyPage'
import { OtherUserProfile } from './OtherUserProfile'

export function Profile(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const { id } = useParams()

  return id === String(loginUser.id) ? <MyPage /> : <OtherUserProfile />
}
