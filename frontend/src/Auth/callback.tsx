import { useEffect, type ReactElement } from 'react'
import { request42AuthToken } from '../utils/authAxios'

export function Auth42callback(): ReactElement {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code !== null) {
      request42AuthToken(code, (token) => {
        localStorage.setItem('42token', token)
        window.location.href = '/'
      })
    }
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Authentication in progress ...</h2>
    </div>
  )
}
