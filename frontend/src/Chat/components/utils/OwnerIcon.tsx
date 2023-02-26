import { Badge } from 'react-bootstrap'
import { isOwner } from './userStatusUtils'

// チャットルームのオーナーを示すアイコンを表示する。
export const OwnerIcon = (props: {
  room: ChatRoom
  user: User
}): JSX.Element => {
  const icon: JSX.Element = isOwner(props.user, props.room) ? (
    <>
      <Badge pill bg="info">
        owner
      </Badge>{' '}
    </>
  ) : (
    <></>
  )
  return icon
}
