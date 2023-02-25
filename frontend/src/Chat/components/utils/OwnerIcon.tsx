import { Badge } from 'react-bootstrap'

// チャットルームのオーナーを示すアイコンを表示する。
export const OwnerIcon = (props: {
  room: ChatRoom
  user: User
}): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.user.id
  const icon: JSX.Element = isOwner ? (
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
