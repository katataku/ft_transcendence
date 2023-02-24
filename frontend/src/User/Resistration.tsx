import React, { type ReactElement } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

async function createUser(data: createUser): Promise<any> {
  const res = await axios.post('/user', data)
  return res
}

export function Resistration(props: {
  user: User
  setUser: Setter<User>
  setLoggedIn: Setter<boolean>
}): ReactElement {
  let userName = ''
  let password = ''
  return (
    <div>
      <Form.Control
        placeholder="UserName"
        onChange={(e) => {
          userName = e.target.value
        }}
        />
      <Form.Control
        placeholder="Password"
        onChange={(e) => {
          password = e.target.value
        }}
        />
      <Button
        onClick={() => {
          createUser({name: userName, password: password}).then(res => {
            props.setUser({ id: Number(res.data.id), name: userName })
          }).catch(() => {/**/})
          props.setLoggedIn(true)
        }}
      >
        Submit
      </Button>
    </div>
  )
}
