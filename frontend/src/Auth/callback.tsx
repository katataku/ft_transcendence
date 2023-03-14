import { type ReactElement } from 'react'

export function Auth42callback(): ReactElement {
  const code = new URLSearchParams(window.location.search).get('code')

  console.log(code)
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Authentication in progress ...</h2>
    </div>
  )
}
