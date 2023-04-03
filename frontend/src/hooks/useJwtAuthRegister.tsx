import { useContext } from 'react'
import { GlobalContext } from '../App'
import { localStorageKey } from '../constants'
import { GameSocketContext } from '../Game/utils/gameSocketContext'
import { validateJwtToken } from '../utils/authAxios'

const useJwtAuthRegister = (): ((accessToken: string) => void) => {
  const gameSocket = useContext(GameSocketContext)
  const { setLoginUser } = useContext(GlobalContext)

  const jwtAuthRegister = (accessToken: string): void => {
    localStorage.setItem(localStorageKey, accessToken)
    validateJwtToken(
      (res: jwtPayload) => {
        const loggedInUser: User = {
          id: res.userId,
          name: res.userName
        }
        gameSocket.emit('loggedIn', loggedInUser)
        setLoginUser(loggedInUser)
      },
      () => {}
    )
  }

  return jwtAuthRegister
}

export default useJwtAuthRegister
