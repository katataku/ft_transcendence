import { useEffect, type ReactElement } from 'react'
import { get42userInfo, request42AuthToken } from '../utils/authAxios'

export function Auth42callback(): ReactElement {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code !== null) {
      request42AuthToken(code, (token) => {
        get42userInfo(token, (res) => {
          console.log(res)
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
