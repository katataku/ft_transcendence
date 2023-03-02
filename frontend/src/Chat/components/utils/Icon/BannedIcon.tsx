import { Badge } from 'react-bootstrap'

export const BannedIcon = (props: { isBanned: boolean }): JSX.Element => {
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
