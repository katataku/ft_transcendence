import React, { type ReactElement } from 'react'
import { Form, Button } from 'react-bootstrap'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

export function Resistration(props: {
  user: User
  setUser: Setter<User>
  setLoggedIn: Setter<boolean>
}): ReactElement {
  let userName = ''
  return (
    <div>
      <Form.Control
        placeholder="UserName"
        onChange={(e) => {
          userName = e.target.value
          // props.setUser({...props.user, name: e.target.value})
        }}
      />
      <Button
        onClick={() => {
          props.setUser({ ...props.user, name: userName })
          props.setLoggedIn(true)
        }}
      >
        Submit
      </Button>
    </div>
  )
}
