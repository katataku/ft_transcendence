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

function updatePaddle(
  paddle: IPaddle,
  keydown: Ref,
  settings: IMatchSettings
): IPaddle {
  const paddleSpeed: number = 10

  switch (keydown.current) {
    case 'ArrowUp':
      if (paddle.pos.y >= paddleSpeed) paddle.pos.y += -paddleSpeed
      break
    case 'ArrowDown':
      if (
        paddle.pos.y <=
        settings.winHght - settings.paddleSize.value.y - paddleSpeed
      ) {
        paddle.pos.y += paddleSpeed
      }
      break
    default:
      break
  }
  return paddle
}

function DrawPaddle(props: {
  paddle: IPaddle
  settings: IMatchSettings
}): ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: `${props.settings.paddleSize.value.x}px`,
        height: `${props.settings.paddleSize.value.y}px`,
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
  const settings = useRef<IMatchSettings>(props.match.settings)
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
      (data: {
        leftPaddle: IPaddle
        rightPaddle: IPaddle
        settings: IMatchSettings
      }) => {
        setLeftPaddle(data.leftPaddle)
        setRightPaddle(data.rightPaddle)
        settings.current = data.settings
      }
    )
  }, [])

  useAnimationFrame((): void => {
    if (props.match.leftPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(leftPaddle, keydown, settings.current)
      })
    } else if (props.match.rightPlayer.name === loginUser.name) {
      gameSocket.emit('updatePaddle', {
        matchID: props.match.id,
        newPaddle: updatePaddle(rightPaddle, keydown, settings.current)
      })
    }
  }, props.status === EStatus.set)

  return (
    <>
      <DrawPaddle paddle={leftPaddle} settings={settings.current} />
      <DrawPaddle paddle={rightPaddle} settings={settings.current} />
    </>
  )
}
