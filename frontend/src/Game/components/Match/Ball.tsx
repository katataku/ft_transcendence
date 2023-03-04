import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'

export function Ball(props: { ball: IBall }): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [ball, setBall] = useState<IBall>(props.ball)
  const ballPx: number = 20

  useEffect(() => {
    gameSocket.on('updateBall', (serverBall: IBall) => {
      setBall(serverBall)
    })
  }, [])

  return (
    <div
      style={{
        width: `${ballPx}px`,
        height: `${ballPx}px`,
        top: `${ball.pos.y}px`,
        left: `${ball.pos.x}px`,
        position: 'absolute',
        backgroundColor: 'white'
      }}
      id="ball"
    />
  )
}
