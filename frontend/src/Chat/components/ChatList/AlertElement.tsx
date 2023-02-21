import { useState } from 'react'
import { Alert } from 'react-bootstrap'

export const AlertElement = (props: { kicked: boolean }): JSX.Element => {
  const [show, setShow] = useState<boolean>(props.kicked)

  return show ? (
    <Alert
      variant="danger"
      onClose={() => {
        setShow(false)
      }}
      dismissible
    >
      <Alert.Heading>You are kicked from the Chat room! </Alert.Heading>
    </Alert>
  ) : (
    <></>
  )
}
