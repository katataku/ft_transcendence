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

const speedOpts = { Easy: 'Slow', Medium: 'Medium', Hard: 'Fast' }
const paddleOpts = { Easy: 'Long', Medium: 'Short', Hard: 'Tiny' }

function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  title: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [opts, _setOpts] = useState(
    props.title === 'Speed' ? speedOpts : paddleOpts
  )

  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || loginUser.name !== props.leftName)
      return
    switch (op) {
      case opts.Easy:
        props.setTitle('Easy')
        break
      case opts.Medium:
        props.setTitle('Medium')
        break
      case opts.Hard:
        props.setTitle('Hard')
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
      <Dropdown.Item eventKey="Easy">Easy</Dropdown.Item>
      <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
      <Dropdown.Item eventKey="Hard">Hard</Dropdown.Item>
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
    gameSocket.on('updateSpeed', (difficultyTitle: string) => {
      setSpeed(difficultyTitle)
    })

  }, [])

  useEffect(() => {
    gameSocket.emit('updateSpeed', {
      matchID: props.matchId,
      difficultyTitle: speed
    })
  }, [speed])

  useEffect(() => {
    gameSocket.emit('updatePaddle', {
      matchID: props.matchId,
      difficultyTitle: speed
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
