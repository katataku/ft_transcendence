import { useEffect, type ReactElement } from 'react'
import { request42AuthToken } from '../utils/authAxios'
import { useNavigate } from 'react-router-dom'
import { isString } from './auth'

let didInit = false

export function Auth42callback(): ReactElement {
  const navigate = useNavigate()

  useEffect(() => {
    if (didInit) return
    didInit = true
    const code = new URLSearchParams(window.location.search).get('code')
    if (code !== null) {
      request42AuthToken(code, (res: SigninRes | string) => {
        if (isString(res)) {
          navigate('/', {
            state: res
          })
        } else {
          const obj = res as SigninRes
          navigate('/', {
            state: {
              userId: obj.userId,
              userName: obj.userName,
              access_token: obj.access_token,
              isTwoFactorEnabled: obj.isTwoFactorEnabled
            }
          })
        }
      })
    }
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Authentication in progress ...</h2>
    </div>
  )
}
