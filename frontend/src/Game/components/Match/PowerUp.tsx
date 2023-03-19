import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Dropdown, DropdownButton, Row, ButtonGroup } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import {
  SpeedOpts,
  PaddleOpts,
  EndScoreOpts,
  PowerUP
} from '../../utils/constants'

function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  title: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [opts, _setOpts] = useState(props.title === PowerUP.Speed ? SpeedOpts : props.title === PowerUP.Paddle ? PaddleOpts : EndScoreOpts)

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
      variant="dark"
      title={props.title}
      onSelect={modifySpeed}
    >
      <Dropdown.Item eventKey={opts.Easy}>{opts.Easy}</Dropdown.Item>
      <Dropdown.Item eventKey={opts.Medium}>{opts.Medium}</Dropdown.Item>
      <Dropdown.Item eventKey={opts.Hard}>{opts.Hard}</Dropdown.Item>
    </DropdownButton>
  )
}

export function PowerUps(props: {
  matchId: number
  leftName: string
  status: EStatus
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [speed, setSpeed] = useState<string>(PowerUP.Speed)
  const [paddle, setPaddle] = useState<string>(PowerUP.Paddle)
  const [endScore, setEndScore] = useState<string>(PowerUP.Score)

  useEffect(() => {
    gameSocket.on(
      'updatePowerUp',
      (data: { type: string; difficulty: string }) => {
        switch (data.type) {
          case PowerUP.Speed:
            setSpeed(data.difficulty)
            break
          case PowerUP.Paddle:
            setPaddle(data.difficulty)
            break
          case PowerUP.Score:
            setEndScore(data.difficulty)
            break
        }
      }
    )
  }, [])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.matchId,
      type: PowerUP.Speed,
      difficulty: speed
    })
  }, [speed])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.matchId,
      type: PowerUP.Paddle,
      difficulty: paddle
    })
  }, [paddle])

  useEffect(() => {
    gameSocket.emit('updatePowerUp', {
      matchID: props.matchId,
      type: PowerUP.Score,
      difficulty: endScore
    })
  }, [endScore])

  return (
    <ButtonGroup className="justify-content-md-center" id="button">
      <h5 id="alignV">Game Settings: </h5>
      <PowerUpDropDown
        status={props.status}
        leftName={props.leftName}
        title={speed}
        setTitle={setSpeed}
      />
      <PowerUpDropDown
        status={props.status}
        leftName={props.leftName}
        title={paddle}
        setTitle={setPaddle}
      />
      <PowerUpDropDown
        status={props.status}
        leftName={props.leftName}
        title={endScore}
        setTitle={setEndScore}
      />
    </ButtonGroup>
  )
}
