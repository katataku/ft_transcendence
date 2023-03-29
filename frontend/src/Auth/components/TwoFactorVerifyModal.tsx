import React, { type ReactElement, useState, useContext } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { localStorageKey } from '../../constants'
import { GameSocketContext } from '../../Game/utils/gameSocketContext'
import { validateJwtToken, verifyOTP } from '../../utils/authAxios'

export function TwoFactorVerifyModal(props: {
  show: boolean
  handleClose: () => void
  userTryingToLogin: User
  setLoginUser: (user: User) => void
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [token, setToken] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (token.length === 0) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
    }

    const obj: VerifyTwoFactorAuth = {
      userId: props.userTryingToLogin.id,
      token
    }

    verifyOTP(obj, (accessToken: string) => {
      localStorage.setItem(localStorageKey, accessToken)
      validateJwtToken(
        (res: jwtPayload) => {
          const loggedInUser: User = {
            id: res.userId,
            name: res.userName
          }
          gameSocket.emit('loggedIn', loggedInUser)
          props.setLoginUser(props.userTryingToLogin)
        },
        () => {}
      )
    })
    event.preventDefault()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setToken(event.target.value)
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>2FA Code Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="token">
            <Form.Label>2FA Code:</Form.Label>
            <Form.Control
              type="text"
              name="token"
              value={token}
              onChange={handleChange}
              isInvalid={isInvalid}
            />
            <Form.Control.Feedback type="invalid">
              This field is required
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
