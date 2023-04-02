import { useEffect, type ReactElement } from 'react'
import { request42AuthToken } from '../utils/authAxios'
import { useNavigate } from 'react-router-dom'

let didinit = false

export function Auth42callback(): ReactElement {
  const navigate = useNavigate()

  useEffect(() => {
    if (didinit) return
    didinit = true
    const code = new URLSearchParams(window.location.search).get('code')
    // apiはTopPageで呼び出しているので、ここでは呼び出さない
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
