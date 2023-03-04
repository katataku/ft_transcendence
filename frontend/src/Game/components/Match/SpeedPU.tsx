import { EStatus } from '../../types/game.model'
import React, {
  type ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Dropdown, DropdownButton } from 'react-bootstrap'

export function SpeedPU(props: {
  leftID: string
  status: EStatus
}): ReactElement {
  const [title, setTitle] = useState<string>('Difficulty')
  const gameSocket = useContext(GameSocketContext)
  const modifySpeed = (op: string | null): void => {
    if (props.status !== EStatus.none || gameSocket.id !== props.leftID) return
    switch (op) {
      case 'easy':
        setTitle('Easy')
        break
      case 'medium':
        setTitle('Medium')
        break
      case 'hard':
        setTitle('Hard')
        break
    }
  }

  useEffect(() => {
    gameSocket.on('updateSpeed', (difficultyTitle: string) => {
      setTitle(difficultyTitle)
    })
  }, [])

  useEffect(() => {
    gameSocket.emit('updateSpeed', title)
  }, [title])

  return (
    <div id="buttonPos">
      <DropdownButton
        id="dropdown-basic-button"
        variant="info"
        title={title}
        onSelect={modifySpeed}
      >
        <Dropdown.Item eventKey="easy">Easy</Dropdown.Item>
        <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
        <Dropdown.Item eventKey="hard">Hard</Dropdown.Item>
      </DropdownButton>
    </div>
  )
}
