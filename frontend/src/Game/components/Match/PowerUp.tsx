import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Dropdown, DropdownButton, Row, Col } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { SpeedOpts, PaddleOpts } from "../../utils/constants";

function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  title: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const opts = props.title === 'Speed' ? SpeedOpts : PaddleOpts

  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || loginUser.name !== props.leftName)
      return
    switch (op) {
      case opts.Easy:
        props.setTitle(opts.Easy)
        break
      case opts.Medium:
        props.setTitle(opts.Medium)
        break
      case opts.Hard:
        props.setTitle(opts.Hard)
        break
    }
  }

  return (
    <DropdownButton
      id="dropdown-basic-button"
      variant="info"
      title={props.title}
      onSelect={modifySpeed}
    >
      <Dropdown.Item eventKey={opts.Easy}>{opts.Easy}</Dropdown.Item>
      <Dropdown.Item eventKey={opts.Medium}>{opts.Medium}</Dropdown.Item>
      <Dropdown.Item eventKey={opts.Hard}>{opts.Hard}</Dropdown.Item>
    </DropdownButton>
  )
}

export function PowerUp(props: {
  matchId: number
  leftName: string
  status: EStatus
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [speed, setSpeed] = useState<string>('Speed')
  const [paddle, setPaddle] = useState<string>('Paddle')

  useEffect(() => {
    gameSocket.on('updatePowerUp', (data: {type: string, difficulty: string}) => {
      switch (data.type) {
        case 'speed':
          setSpeed(data.difficulty)
          break
        case 'paddle':
          setPaddle(data.difficulty)
          break
      }
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.matchId,
      type: 'speed',
      difficulty: speed
    })
  }, [speed])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.matchId,
      type: 'paddle',
      difficulty: paddle
    })
  }, [paddle])

  return (
    <Row>
      <Col>
        <PowerUpDropDown
          status={props.status}
          leftName={props.leftName}
          title={speed}
          setTitle={setSpeed}
        />
      </Col>
      <Col>
        <PowerUpDropDown
          status={props.status}
          leftName={props.leftName}
          title={paddle}
          setTitle={setPaddle}
        />
      </Col>
    </Row>
  )
}
