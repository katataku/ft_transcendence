import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { useAnimationFrame } from '../../../hooks/useAnimationFrame'
type Ref = React.MutableRefObject<any>

const gameWinHght: number = 500
const paddleSpeed: number = 10

const paddleSize: Vector2 = {
  x: 8,
  y: 100
}

function updatePaddle(paddle: IPaddle, keydown: Ref): IPaddle {
  switch (keydown.current) {
    case 'ArrowUp':
      if (paddle.pos.y >= paddleSpeed) paddle.pos.y += -paddleSpeed
      break
    case 'ArrowDown':
      if (paddle.pos.y <= gameWinHght - paddleSize.y - paddleSpeed) {
        paddle.pos.y += paddleSpeed
      }
      break
    default:
      break
  }
  return paddle
}

export function Paddles(props: {
  match: IMatch
  status: EStatus
}): ReactElement {
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(
    props.match.leftPlayer.paddle
  )
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(
    props.match.rightPlayer.paddle
  )
  const keydown = useRef<string>('')
  const gameSocket = useContext(GameSocketContext)
  const leftSocketID = props.match.leftPlayer.socketID
  const rightSocketID = props.match.rightPlayer.socketID

  const handleOnKeyDown = (e: KeyboardEvent): void => {
    keydown.current = e.code
  }
  const handleOnKeyUp = (): void => {
    keydown.current = ''
  }

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDown)
    window.addEventListener('keyup', handleOnKeyUp)
    gameSocket.on(
      'updatePaddle',
      (data: { leftPaddle: IPaddle; rightPaddle: IPaddle }) => {
        if (leftSocketID !== gameSocket.id) setLeftPaddle(data.leftPaddle)
        if (rightSocketID !== gameSocket.id) setRightPaddle(data.rightPaddle)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (leftSocketID === gameSocket.id) {
      const newPaddle = updatePaddle(leftPaddle, keydown)
      setLeftPaddle(newPaddle)
      gameSocket.emit('updatePaddle', newPaddle)
    } else if (rightSocketID === gameSocket.id) {
      const newPaddle = updatePaddle(rightPaddle, keydown)
      setRightPaddle(newPaddle)
      gameSocket.emit('updatePaddle', newPaddle)
    }
  }, props.status === EStatus.set)

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          width: `${paddleSize.x}px`,
          height: `${paddleSize.y}px`,
          position: 'absolute',
          top: `${leftPaddle.pos.y}px`,
          left: `${leftPaddle.pos.x}px`
        }}
        id="paddle"
      />
      <div
        style={{
          backgroundColor: 'white',
          width: `${paddleSize.x}px`,
          height: `${paddleSize.y}px`,
          position: 'absolute',
          top: `${rightPaddle.pos.y}px`,
          left: `${rightPaddle.pos.x}px`
        }}
        id="paddle"
      />
    </>
  )
}
