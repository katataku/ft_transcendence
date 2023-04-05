import React, { type ReactElement, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { checkUsernameAvailability, ftSignUp } from '../../utils/userAxios'
import useJwtAuthRegister from '../../hooks/useJwtAuthRegister'

function UserNameFormModal(props: {
  show: boolean
  handleClose: () => void
  ftToken: string
}): ReactElement {
  const jwtAuthRegister = useJwtAuthRegister()
  const [userName, setUserName] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setUserName(e.target.value)
  }

  function handleSubmit(): void {
    checkUsernameAvailability(
      userName,
      () => {
        ftSignUp({ userName, token: props.ftToken }, (accessToken: string) => {
          jwtAuthRegister(accessToken)
          props.handleClose()
        })
      },
      () => {
        alert('Username already exists, so try another username.')
      }
    )
  }

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={userName}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserNameFormModal
