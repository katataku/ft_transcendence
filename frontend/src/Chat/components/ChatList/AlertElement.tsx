import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { chatListKickAlertLocalStorageKey } from '../../../constants'

export const AlertElement = (): JSX.Element => {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    const data = localStorage.getItem(chatListKickAlertLocalStorageKey)
    if (data !== null) {
      setShow(true)
    }
  }, [])

  return show ? (
    <Alert
      variant="danger"
      onClose={() => {
        setShow(false)
        localStorage.removeItem(chatListKickAlertLocalStorageKey)
      }}
      dismissible
    >
      <Alert.Heading>You are kicked from the Chat room! </Alert.Heading>
    </Alert>
  ) : (
    <></>
  )
}
