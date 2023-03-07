import { Badge } from 'react-bootstrap'

export const BlockIcon = (props: { isBlocked: boolean }): JSX.Element => {
  const icon: JSX.Element = props.isBlocked ? (
    <>
      <Badge pill bg="danger">
        Blocked
      </Badge>
    </>
  ) : (
    <></>
  )
  return icon
}
