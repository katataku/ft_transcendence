import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import { GlobalContext } from '../../../App'

export const SpeedOpts = {
  Easy: { desc: 'Speed-Slow', value: 300 },
  Medium: { desc: 'Speed-Medium', value: 500 },
  Hard: { desc: 'Speed-Fast', value: 700 }
}

export const PaddleOpts = {
  Easy: { desc: 'Paddle-Large', value: { x: 8, y: 120 } },
  Medium: { desc: 'Paddle-Medium', value: { x: 8, y: 80 } },
  Hard: { desc: 'Paddle-Small', value: { x: 8, y: 40 } }
}

export const EndScoreOpts = {
  Easy: { desc: 'End Score-3', value: 3 },
  Medium: { desc: 'End Score-7', value: 7 },
  Hard: { desc: 'End Score-10', value: 10 }
}
function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  title: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [opts, _setOpts] = useState(
    props.title === PowerUP.Speed
      ? SpeedOpts
      : props.title === PowerUP.Paddle
      ? PaddleOpts
      : EndScoreOpts
  )

  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || loginUser.name !== props.leftName)
      return
    switch (op) {
      case opts.Easy.desc:
        props.setTitle(opts.Easy.desc)
        break
      case opts.Medium.desc:
        props.setTitle(opts.Medium.desc)
        break
      case opts.Hard.desc:
        props.setTitle(opts.Hard.desc)
        break
    }
  }

  return (
    <DropdownButton
      id="dropdown-basic-button"
      variant="dark"
      title={props.title}
      onSelect={modifySpeed}
    >
      <Dropdown.Item eventKey={opts.Easy.desc}>{opts.Easy.desc}</Dropdown.Item>
      <Dropdown.Item eventKey={opts.Medium.desc}>
        {opts.Medium.desc}
      </Dropdown.Item>
      <Dropdown.Item eventKey={opts.Hard.desc}>{opts.Hard.desc}</Dropdown.Item>
    </DropdownButton>
  )
}
export const PowerUP = {
  Speed: 'Speed',
  Paddle: 'Paddle',
  Score: 'Score'
}
export function PowerUps(props: {
  match: IMatch
  status: EStatus
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [speed, setSpeed] = useState<string>(
    props.match.settings.ballSpeed.desc
  )
  const [paddle, setPaddle] = useState<string>(
    props.match.settings.paddleSize.desc
  )
  const [endScore, setEndScore] = useState<string>(
    props.match.settings.winScore.desc
  )

  useEffect(() => {
    gameSocket.on('updatePowerUp', (data: { match: IMatch }) => {
      setSpeed(data.match.settings.ballSpeed.desc)
      setPaddle(data.match.settings.paddleSize.desc)
      setEndScore(data.match.settings.winScore.desc)
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: PowerUP.Speed,
      difficulty: speed
    })
  }, [speed])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: PowerUP.Paddle,
      difficulty: paddle
    })
  }, [paddle])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: PowerUP.Score,
      difficulty: endScore
    })
  }, [endScore])

  return (
    <ButtonGroup className="justify-content-md-center" id="button">
      <h5 id="alignV">Game Settings: </h5>
      <PowerUpDropDown
        status={props.status}
        leftName={props.match.leftPlayer.name}
        title={speed}
        setTitle={setSpeed}
      />
      <PowerUpDropDown
        status={props.status}
        leftName={props.match.leftPlayer.name}
        title={paddle}
        setTitle={setPaddle}
      />
      <PowerUpDropDown
        status={props.status}
        leftName={props.match.leftPlayer.name}
        title={endScore}
        setTitle={setEndScore}
      />
    </ButtonGroup>
  )
}
