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

const paddleSize: Vector2 = {
  x: 8,
  y: 100
}

function updatePaddle(paddle: IPaddle, keydown: Ref): IPaddle {
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

function DrawPaddle(props: { paddle: IPaddle }): ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: `${paddleSize.x}px`,
        height: `${paddleSize.y}px`,
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
        setLeftPaddle(data.leftPaddle)
        setRightPaddle(data.rightPaddle)
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.match.leftPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(leftPaddle, keydown)
      })
    } else if (props.match.rightPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(rightPaddle, keydown)
      })
    }
  }, props.status === EStatus.set)

  return (
    <>
      <DrawPaddle paddle={leftPaddle} />
      <DrawPaddle paddle={rightPaddle} />
    </>
  )
}
