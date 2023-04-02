import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'

export function Ball(props: { match: IMatch }): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [ball, setBall] = useState<IBall>(props.match.ball)

  useEffect(() => {
    gameSocket.on('updateBall', (serverBall: IBall) => {
      setBall(serverBall)
    })
  }, [])

  return (
    <div
      style={{
        width: `${props.match.settings.ballPx}px`,
        height: `${props.match.settings.ballPx}px`,
        top: `${ball.pos.y}px`,
        left: `${ball.pos.x}px`,
        position: 'absolute',
        backgroundColor: 'white'
      }}
      id="ball"
    />
  )
}
