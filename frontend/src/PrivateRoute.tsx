import React, { useEffect, useState, type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { validateJwtToken } from './utils/authAxios'

export function Private(props: { element: ReactElement }): ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  useEffect(() => {
    validateJwtToken(
      () => {
        setIsAuthenticated(true)
      },
      () => {
        setIsAuthenticated(false)
      }
    )
  }, [])
  if (isAuthenticated === null) {
    return <></>
  }

  return isAuthenticated ? props.element : <Navigate to="/" />
}
