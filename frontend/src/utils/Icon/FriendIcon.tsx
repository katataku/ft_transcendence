import { Badge } from 'react-bootstrap'

export const FriendIcon = (props: { isFriend: boolean }): JSX.Element => {
  const icon: JSX.Element = props.isFriend ? (
    <>
      <Badge pill bg="info">
        Friend
      </Badge>
    </>
  ) : (
    <></>
  )
  return icon
}
