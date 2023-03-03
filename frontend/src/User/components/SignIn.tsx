import { type ReactElement } from 'react'
import { Form, Button, Image as Img } from 'react-bootstrap'
import { useState } from 'react'
import { resizeAndEncode, createUser } from '../functions/user.functions'

export function SignIn(props: {
  user: User
  setUser: Setter<User>
  setSignedIn: Setter<boolean>
}): ReactElement {
  const [signUpMode, setSignUpMode] = useState<boolean>(true)
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [image, setImage] = useState<string>('')

  function toggle(): void {
    setSignUpMode(!signUpMode)
  }

  return (
    <div>
      <h2>{signUpMode ? 'Sign Up' : 'Sign In'}</h2>
      <div>
        {
          signUpMode
          ? <div>Already have an account?<Button variant='link' onClick={toggle}>Sign In</Button></div>
          : <div>Don&apos;t have an account<Button variant='link' onClick={toggle}>Sign Up</Button></div>
        }
      </div>
      <Form.Control
        placeholder="UserName"
        onChange={(e) => {
          setUserName(e.target.value)
        }}
      />
      <Form.Control
        placeholder="Password"
        type="password"
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <Form.Control
        type="file"
        accept="imgage/png"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0] as File
          resizeAndEncode(file)
            .then((res) => {
              setImage(res)
            })
            .catch((err) => {
              console.error(err)
              alert('Onl .png is accepted.')
              setImage('')
            })
        }}
      />
      <Img src={image} style={{ borderRadius: '50%' }} height={300} />
      <br />
      <Button
        onClick={() => {
          console.log(image)
          createUser({ name: userName, password, avatar: image })
            .then((res) => {
              props.setUser({ id: Number(res.data.id), name: userName })
            })
            .catch(() => {
              /**/
            })
          props.setSignedIn(true)
        }}
      >
        Submit
      </Button>
    </div>
  )
}
