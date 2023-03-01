import { Badge } from 'react-bootstrap'

export const MutedIcon = (props: { isMuted: boolean }): JSX.Element => {
  const icon: JSX.Element = props.isMuted ? (
    <>
      <Badge pill bg="danger">
        muted
      </Badge>{' '}
    </>
  ) : (
    <></>
  )
  return icon
}
