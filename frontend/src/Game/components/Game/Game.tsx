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
    <Container id="header">
      <Row>
        <Player matchID={props.match.id} player={props.match.leftPlayer} />
        <Player matchID={props.match.id} player={props.match.rightPlayer} />
      </Row>
      <Match match={props.match} />
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
    gameSocket.on('matching', () => {
      setShowSpinner(true)
    })
    gameSocket.on('inQueue', () => {
      alert('Already in matching queue...')
    })
  }, [])

  const handleClick = (): void => {
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {props.hasResponse && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <h1 style={{ fontSize: 100 }}>PONG</h1>
          <p style={{ fontSize: 20, marginTop: 30 }}>
            Use the arrow keys to move the paddle
          </p>
          <Button
            onClick={handleClick}
            disabled={showSpinner}
            style={{ fontSize: 30, marginTop: 20 }}
          >
            {showSpinner ? (
              <div>
                <Spinner animation="border" /> matching...
              </div>
            ) : (
              'Play'
            )}
          </Button>
          {showSpinner && !matchFound && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20
              }}
            >
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
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
