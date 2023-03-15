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
import { GlobalContext } from '../../../App'
type Ref = React.MutableRefObject<any>

const initPaddleSize: Vector2 = {
  x: 8,
  y: 100
}

function updatePaddle(paddle: IPaddle, keydown: Ref, paddleSize: Vector2): IPaddle {
  const paddleSpeed: number = 10
  const gameWinHght: number = 500

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

function DrawPaddle(props: { paddle: IPaddle, paddleSize: Vector2}): ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: `${props.paddleSize.x}px`,
        height: `${props.paddleSize.y}px`,
        position: 'absolute',
        top: `${props.paddle.pos.y}px`,
        left: `${props.paddle.pos.x}px`
      }}
      id="paddle"
    />
  )
}

export function Paddles(props: {
  match: IMatch
  status: EStatus
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const { loginUser } = useContext(GlobalContext)
  const keydown = useRef<string>('')
  const [leftPaddle, setLeftPaddle] = useState<IPaddle>(
    props.match.leftPlayer.paddle
  )
  const [rightPaddle, setRightPaddle] = useState<IPaddle>(
    props.match.rightPlayer.paddle
  )
  const [paddleSize, setPaddleSize] = useState<Vector2>(initPaddleSize)

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
      (data: { leftPaddle: IPaddle; rightPaddle: IPaddle, paddleSize: Vector2 }) => {
        setLeftPaddle(data.leftPaddle)
        setRightPaddle(data.rightPaddle)
        setPaddleSize(data.paddleSize)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.match.leftPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(leftPaddle, keydown, paddleSize)
      })
    } else if (props.match.rightPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(rightPaddle, keydown, paddleSize)
      })
    }
  }, props.status === EStatus.set)

  return (
    <>
      <DrawPaddle paddle={leftPaddle} paddleSize={paddleSize}/>
      <DrawPaddle paddle={rightPaddle} paddleSize={paddleSize}/>
    </>
  )
}
