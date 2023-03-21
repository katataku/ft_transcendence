import { type ReactElement, useContext } from 'react'
import { Form, Button, Image as Img } from 'react-bootstrap'
import { useState } from 'react'
import { resizeAndEncode } from '../functions/user.functions'
import { GlobalContext } from '../../App'
import {
  checkUsernameAvailability,
  signIn,
  signUp
} from '../../utils/userAxios'
import { BaseURL } from '../../constants'
import { authenticateWith42 } from '../../Auth/auth'

export const defaultAvatar = `${BaseURL}/user/user_avatar/0`

export function SignIn(): ReactElement {
  const { setLoginUser, setIsSignedIn } = useContext(GlobalContext)
  const [signUpMode, setSignUpMode] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [image, setImage] = useState<string>(defaultAvatar)

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
              accept="image/png"
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
              checkUsernameAvailability(
                userName,
                () => {
                  signUp({ name: userName, password, avatar: image }, (res) => {
                    setLoginUser({ id: res, name: userName })
                    setIsSignedIn(true)
                  })
                },
                () => {
                  alert('Username already exists, so try another username.')
                }
              )
            } else {
              signIn({ id: Number(userName), password }, (res) => {
                setLoginUser({ id: res.id, name: res.name })
                setIsSignedIn(true)
              })
            }
          }}
        >
          Submit
        </Button>
        <br />
        <Button style={{ margin: '10px' }} onClick={authenticateWith42}>
          Sign up with 42
        </Button>

        {
          /* For Debug */
          ['guest1', 'guest2', 'guest3', 'guest4'].map((name, index) => (
            <p key={index}>
              <Button
                data-cy={`login-as-${name}`}
                variant="warning"
                onClick={() => {
                  setLoginUser({ id: index + 1, name })
                  setIsSignedIn(true)
                }}
              >
                Login as {name}
              </Button>
            </p>
          ))
        }
      </div>
    </div>
  )
}
