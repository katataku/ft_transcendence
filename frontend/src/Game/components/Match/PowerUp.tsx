import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { GlobalContext } from '../../../App'

function PowerUpDropDown(props: {
  status: EStatus
  leftName: string
  setTitle: Setter<string>
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || loginUser.name !== props.leftName)
      return
    switch (op) {
      case 'easy':
        props.setTitle('Easy')
        break
      case 'medium':
        props.setTitle('Medium')
        break
      case 'hard':
        props.setTitle('Hard')
        break
    }
  }

  return (
    <div id="buttonPos">
      <DropdownButton
        id="dropdown-basic-button"
        variant="info"
        title="Difficulty"
        onSelect={modifySpeed}
      >
        <Dropdown.Item eventKey="easy">Easy</Dropdown.Item>
        <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
        <Dropdown.Item eventKey="hard">Hard</Dropdown.Item>
      </DropdownButton>
    </div>
  )
}

export function PowerUp(props: {
  matchId: number
  leftName: string
  status: EStatus
}): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const [title, setTitle] = useState<string>('Difficulty')

  useEffect(() => {
    gameSocket.on('updateSpeed', (difficultyTitle: string) => {
      setTitle(difficultyTitle)
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updateSpeed', {
      matchID: props.matchId,
      difficultyTitle: title
    })
  }, [title])

  return (
    <PowerUpDropDown
      status={props.status}
      leftName={props.leftName}
      setTitle={setTitle}
    />
  )
}
