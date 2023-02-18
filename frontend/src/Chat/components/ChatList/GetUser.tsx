import axios from 'axios'
import { useState, type ReactElement } from 'react'
import { Button } from 'react-bootstrap'

export const GetUser = (props: {
  setUser: React.Dispatch<React.SetStateAction<User>>
}): ReactElement => {
  const [name, setName] = useState<string>('')

  const handleGetUserButton = (): void => {
    axios
      .get<User>('/user/' + name)
      .then((response) => {
        props.setUser(response.data)
        const user: User = response.data
        console.log('user id : ' + String(user.id))
        console.log('user name : ' + String(user.name))
      })
      .catch(() => {
        alert('エラーです！')
      })
  }

  return (
    <>
      <p>Enter your name and Move on to a chat room.</p>
      <p>
        name:
        <label>
          <input
            name="name"
            type="text"
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <Button onClick={handleGetUserButton}>get User info</Button>
        </label>
      </p>
    </>
  )
}
