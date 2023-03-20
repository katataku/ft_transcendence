import React, { type ReactElement, useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { verifyOTP } from '../../utils/authAxios'

export function TwoFactorVerifyModal(props: {
  show: boolean
  setShow: (bool: boolean) => void
  handleClose: () => void
  registeringUser: User
  setLoginUser: (user: User) => void
  setIsSignedIn: (a: boolean) => void
}): ReactElement {
  const [token, setToken] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (token.length === 0) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
    }

    const obj: VerifyTwoFactorAuth = {
      userId: props.registeringUser.id,
      token
    }

    verifyOTP(obj, (res: boolean) => {
      if (res) {
        console.log('verify')
        props.setIsSignedIn(true)
        props.setLoginUser(props.registeringUser)
        props.setShow(false)
      } else {
        console.log('code invalid')
      }
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
