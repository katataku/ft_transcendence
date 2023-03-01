import { Badge } from 'react-bootstrap'

// チャットルームのオーナーを示すアイコンを表示する。
export const OwnerIcon = (props: { isOwner: boolean }): JSX.Element => {
  const icon: JSX.Element = props.isOwner ? (
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
