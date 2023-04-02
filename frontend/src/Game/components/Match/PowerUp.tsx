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
import * as constants from '../../utils/constants'

function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  title: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [opts, _setOpts] = useState(
    props.title === constants.PowerUP.Speed
      ? constants.SpeedOpts
      : props.title === constants.PowerUP.Paddle
      ? constants.PaddleOpts
      : constants.EndScoreOpts
  )

  const modifySpeed = (op: string | null): void => {
    if (
      props.status !== EStatus.none ||
      loginUser.name !== props.leftName ||
      op === null
    )
      return
    props.setTitle(op)
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
    gameSocket.on('updatePowerUp', (data: { settings: IMatchSettings }) => {
      setSpeed(data.settings.ballSpeed.desc)
      setPaddle(data.settings.paddleSize.desc)
      setEndScore(data.settings.winScore.desc)
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: constants.PowerUP.Speed,
      difficulty: speed
    })
  }, [speed])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: constants.PowerUP.Paddle,
      difficulty: paddle
    })
  }, [paddle])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.match.id,
      type: constants.PowerUP.Score,
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
