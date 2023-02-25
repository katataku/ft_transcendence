import { Badge } from 'react-bootstrap'

export const BannedIcon = (props: {
  room: ChatRoom
  user: User
  isBanned: boolean
}): JSX.Element => {
  const icon: JSX.Element = props.isBanned ? (
    <>
      <Badge pill bg="danger">
        banned
      </Badge>{' '}
    </>
  ) : (
    <></>
  )
  return icon
}
