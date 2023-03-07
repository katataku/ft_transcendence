import React, {
  type ReactElement,
  useState,
  useEffect,
  useContext
} from 'react'
import { Row, Container, Button, Spinner } from 'react-bootstrap'
import '../../assets/styles.css'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Match } from '../Match/Match'
import { Player } from './Player'
import { GlobalContext } from '../../../App'
import { useLocation } from 'react-router-dom'

function Playing(props: { match: IMatch }): ReactElement {
  return (
    <Container>
      <Row id="header">
        <Player matchID={props.match.id} player={props.match.leftPlayer} />
        <Player matchID={props.match.id} player={props.match.rightPlayer} />
      </Row>
      <Row>
        <Match match={props.match} />
      </Row>
    </Container>
  )
}

function Matching(props: { hasResponse: boolean }): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const { loginUser } = useContext(GlobalContext)
  const [showSpinner, setShowSpinner] = useState(false)
  const [matchFound, setMatchFound] = useState(false)

  useEffect(() => {
    gameSocket.on('matchFound', () => {
      setMatchFound(true)
    })
  }, [])

  const handleClick = (): void => {
    setShowSpinner(true)
    gameSocket.emit('matching', {
      userId: loginUser.id,
      userName: loginUser.name
    })
  }

  const handleCancel = (): void => {
    setShowSpinner(false)
    gameSocket.emit('matchingCancel', loginUser.name)
  }

  return (
    <div>
      {props.hasResponse && (
        <Button onClick={handleClick} disabled={showSpinner}>
          {showSpinner ? (
            <div>
              <Spinner animation="border" /> matching...
            </div>
          ) : (
            'play'
          )}
        </Button>
      )}
      {showSpinner && !matchFound && (
        <Button variant="danger" onClick={handleCancel}>
          cancel
        </Button>
      )}
    </div>
  )
}

export function Game(): ReactElement {
  const [match, setMatch] = useState<IMatch | undefined>(undefined)
  const [hasResponse, setHasResponse] = useState<boolean>(false)
  const gameSocket = useContext(GameSocketContext)
  const { loginUser } = useContext(GlobalContext)
  const matchId = useLocation().state

  useEffect(() => {
    gameSocket.emit('updateConnections', {
      matchID: matchId,
      userName: loginUser.name
    })
    gameSocket.on('updateConnections', (serverMatch: IMatch) => {
      setMatch(serverMatch)
      setHasResponse(true)
    })
  }, [])

  function matchPending(): boolean {
    return (
      match === undefined ||
      match.leftPlayer === undefined ||
      match.rightPlayer === undefined
    )
  }

  return matchPending() ? (
    <Matching hasResponse={hasResponse} />
  ) : (
    // @ts-expect-error matchPendingはundefinedのマッチを確認してます
    <Playing match={match} />
  )
}
