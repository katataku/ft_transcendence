import { type ReactElement, useEffect } from 'react'
import { Form, Button, Image as Img } from 'react-bootstrap'
import { useState } from 'react'
import { resizeAndEncode } from '../functions/user.functions'
import { checkUsernameAvailability, signUp } from '../../utils/userAxios'
import { BaseURL, initUser } from '../../constants'
import { authenticateWith42, isString } from '../../Auth/auth'
import { TwoFactorVerifyModal } from '../../Auth/components/TwoFactorVerifyModal'
import { signIn } from '../../utils/authAxios'
import { useLocation, useNavigate } from 'react-router-dom'
import useJwtAuthRegister from '../../hooks/useJwtAuthRegister'
import UserNameFormModal from './UserNameFormModal'

export const defaultAvatar = `${BaseURL}/user/user_avatar/0`

let didInit = false

export function SignIn(): ReactElement {
  const jwtAuthRegister = useJwtAuthRegister()
  const location: SigninRes | string | null = useLocation().state
  const navigate = useNavigate()
  const [signUpMode, setSignUpMode] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [image, setImage] = useState<string>(defaultAvatar)
  const [twoFactorVerifyModalshow, setTwoFactorVerifyModalshow] =
    useState(false)
  const [userTryingToLogin, setUserTryingToLogin] = useState<User>(initUser)
  const [userNameFormModalshow, setUserNameFormModalshow] = useState(false)

  function handleTwoFAModalClose(): void {
    setTwoFactorVerifyModalshow(false)
  }

  function handleTwoFAModalShow(): void {
    setTwoFactorVerifyModalshow(true)
  }

  function handleNameFormModalClose(): void {
    setUserNameFormModalshow(false)
    navigate('/', { state: null, replace: true })
  }

  function handleNameFormModalShow(): void {
    setUserNameFormModalshow(true)
  }

  function toggleMode(): void {
    setSignUpMode(!signUpMode)
  }

  function toggleShowPassword(): void {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    if (didInit) return
    didInit = true
    if (location === null) return

    if (isString(location)) handleNameFormModalShow()
    else {
      handleSuccessfulSignIn(location as SigninRes)
      navigate('/', { state: null, replace: true })
    }
  }, [])

  function handleSuccessfulSignIn(signinRes: SigninRes): void {
    // 2faが有効なら、2faの確認モーダルを表示します。
    if (signinRes.isTwoFactorEnabled) {
      setUserTryingToLogin({ id: signinRes.userId, name: signinRes.userName })
      handleTwoFAModalShow()
    } else {
      if (signinRes.access_token === undefined) return
      jwtAuthRegister(signinRes.access_token)
    }
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
          placeholder={'UserName'}
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
                  signUp(
                    {
                      name: userName,
                      password,
                      avatar: image,
                      is42User: false
                    },
                    () => {
                      signIn(
                        { name: userName, password },
                        handleSuccessfulSignIn
                      )
                    }
                  )
                },
                () => {
                  alert('Username already exists, so try another username.')
                }
              )
            } else {
              signIn({ name: userName, password }, handleSuccessfulSignIn)
            }
          }}
        >
          {signUpMode ? 'Sign up' : 'Sign in'}
        </Button>
        <br />
        <Button style={{ margin: '10px' }} onClick={authenticateWith42}>
          Sign in with 42
        </Button>

        {
          /* For Debug */
          ['guest1', 'guest2', 'guest3', 'guest4'].map((name, index) => (
            <p key={index}>
              <Button
                data-cy={`login-as-${name}`}
                variant="warning"
                onClick={() => {
                  signIn({ name, password: 'password' }, handleSuccessfulSignIn)
                }}
              >
                Sign in as {name}
              </Button>
            </p>
          ))
        }
      </div>
      <TwoFactorVerifyModal
        show={twoFactorVerifyModalshow}
        handleClose={handleTwoFAModalClose}
        userTryingToLogin={userTryingToLogin}
      ></TwoFactorVerifyModal>
      <UserNameFormModal
        show={userNameFormModalshow}
        handleClose={handleNameFormModalClose}
        ftToken={location as string}
      ></UserNameFormModal>
    </div>
  )
}
