import { type ReactElement, useContext } from 'react'
import { Form, Button, Image as Img } from 'react-bootstrap'
import { useState } from 'react'
import { resizeAndEncode } from '../functions/user.functions'
import { noImage64 } from '../constants'
import { GlobalContext } from '../../App'
import { signIn, signUp } from '../../utils/userAxios'

export function SignIn(): ReactElement {
  const { setLoginUser, setIsSignedIn } = useContext(GlobalContext)
  const [signUpMode, setSignUpMode] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [image, setImage] = useState<string>(noImage64)

  function toggleMode(): void {
    setSignUpMode(!signUpMode)
  }

  function toggleShowPassword(): void {
    setShowPassword(!showPassword)
  }

  return (
    <div style={{ margin: '50px 100px', textAlign: 'center' }}>
      <h2>{signUpMode ? 'Sign Up' : 'Sign In'}</h2>
      <div>
        {signUpMode ? (
          <div>
            Already have an account?
            <Button variant="link" onClick={toggleMode}>
              Sign In
            </Button>
          </div>
        ) : (
          <div>
            Don&apos;t have an account
            <Button variant="link" onClick={toggleMode}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div style={{ width: '500px', margin: 'auto' }}>
        <Form.Control
          placeholder={signUpMode ? 'UserName' : 'UserID'}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        />
        <Form.Control
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <Form.Check
          type="switch"
          label="show"
          style={{ width: '100px' }}
          onChange={toggleShowPassword}
        />
        {signUpMode ? (
          <div>
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
                    alert('Only .png is accepted.')
                    setImage('')
                  })
              }}
            />
            <Img
              src={image}
              style={{ borderRadius: '50%', margin: '30px' }}
              height={300}
            />
          </div>
        ) : (
          <></>
        )}

        <br />
        <Button
          onClick={() => {
            if (signUpMode) {
              signUp({ name: userName, password, avatar: image }, res => {
                setLoginUser({ id: res, name: userName })
              })
              setIsSignedIn(true)
            } else {
              signIn({ id: Number(userName), password }, res => {
                setLoginUser({ id: res.id, name: res.name })
                setIsSignedIn(true)
              })
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
