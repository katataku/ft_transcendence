import { useEffect, type ReactElement } from 'react'
import { request42AuthToken } from '../utils/authAxios'
import { useNavigate } from 'react-router-dom'

let didInit = false

export function Auth42callback(): ReactElement {
  const navigate = useNavigate()

  useEffect(() => {
    if (didInit) return
    didInit = true
    const code = new URLSearchParams(window.location.search).get('code')
    if (code !== null) {
      request42AuthToken(code, (res: SigninRes) => {
        navigate('/', {
          state: {
            userId: res.userId,
            userName: res.userName,
            access_token: res.access_token,
            isTwoFactorEnabled: res.isTwoFactorEnabled
          }
        })
      })
    }
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Authentication in progress ...</h2>
    </div>
  )
}
