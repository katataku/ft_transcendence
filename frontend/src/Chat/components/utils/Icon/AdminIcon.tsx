import { Badge } from 'react-bootstrap'

export const AdminIcon = (props: { isAdmin: boolean }): JSX.Element => {
  const icon: JSX.Element = props.isAdmin ? (
    <>
      <Badge pill bg="info">
        Admin
      </Badge>{' '}
    </>
  ) : (
    <></>
  )
  return icon
}
