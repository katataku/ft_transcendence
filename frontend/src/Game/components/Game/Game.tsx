import React, {
  type ReactElement,
  useState,
  useEffect,
  useContext
} from 'react'
import { Row, Container } from 'react-bootstrap'
import '../../assets/styles.css'
// import { useLocation } from 'react-router-dom'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Match } from '../Match/Match'
import { Player } from './Player'

function Playing(props: { match: IMatch }): ReactElement {
  return (
    <Container>
      <Row id="header">
        <Player player={props.match.leftPlayer} />
        <Player player={props.match.rightPlayer} />
      </Row>
      <Row>
        <Match match={props.match} />
      </Row>
    </Container>
  )
}

function Matching(): ReactElement {
  const gameSocket = useContext(GameSocketContext)

  function findMatch(): void {
    gameSocket.emit('updateConnections')
  }

  return (
    <div>
      <h1>matching...</h1>
      <button onClick={findMatch}>updateMatch</button>
    </div>
  )
}

export function Game(): ReactElement {
  const [match, setMatch] = useState<IMatch | undefined>(undefined)
  const gameSocket = useContext(GameSocketContext)

  useEffect(() => {
    gameSocket.emit('updateConnections')
    gameSocket.on('updateConnections', (serverMatch: IMatch) => {
      // setMatch({...serverMatch, id: useLocation().state})
      setMatch(serverMatch)
    })
  }, [])

  function matchPending(): boolean {
    return (
      match === undefined ||
      match.leftPlayer === undefined ||
      match.rightPlayer === undefined
    )
  }

  // @ts-expect-error matchPendingはundefinedのマッチを確認してます
  return matchPending() ? <Matching /> : <Playing match={match} />
}
