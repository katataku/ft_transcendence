import React, { type ReactElement } from 'react'
import axios from 'axios'
export function Login (): ReactElement {
  return (
    <div className="Login">
      <button onClick={req}>Log in</button>
    </div>
  )
}

function req (): void {
  // const res = await axios.get('http://localhost:3001/api')
  // console.log(res.data)
}
