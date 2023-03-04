import React, { type ReactElement, useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../assets/styles.css'
import { useLocation } from 'react-router-dom'
import {
  type IMatch,
  type IPlayer,
} from '../types/game.model'
import { GameSocketContext } from './context'
import { Match } from './Match'

let selfName: string

function Ready(props: { player: IPlayer }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)
  const matchState = useLocation().state
  const gameSocket = useContext(GameSocketContext)

  function setReady(): void {
    if (
      props.player.socketID === gameSocket.id &&
      button === grayButton
      selfName === matchState.userName
    ) {
      gameSocket.emit('updatePlayerReady', props.player.socketID)
    }
  }

  if (button === grayButton && props.player.ready) setButton(greenButton)

  return (
    <button type="button" className={button} onClick={setReady}>
      Ready
    </button>
  )
}

function Player(props: { player: IPlayer }): ReactElement {
  return (
    <Col>
      <div className="display-4">
        {props.player.name.slice(0, 7)}&emsp;
        <Ready player={props.player} />
      </div>
      <div className="border">
        <h4>Match History</h4>
        <h6>
          wins:<span className="text-success">{props.player.wins} </span>
          losses:<span className="text-danger">{props.player.losses}</span>
        </h6>
      </div>
    </Col>
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
  const matchState = useLocation().state
  console.log(matchState)

  const gameSocket = useContext(GameSocketContext)

  const [match, setMatch] = useState<IMatch | undefined>(undefined)

  useEffect(() => {
    selfName = matchState.userName
    gameSocket.emit('updateConnections')
    gameSocket.on('updateConnections', (serverMatch: IMatch) => {
      setMatch(serverMatch)
    })
  }, [])

  return match === undefined ||
    match.leftPlayer === undefined ||
    match.rightPlayer === undefined ? (
    <Matching />
  ) : (
    <Container>
      <Row id="header">
        <Player player={match.leftPlayer} />
        <Player player={match.rightPlayer} />
      </Row>
      <Row>
        <Match match={match} />
      </Row>
    </Container>
  )
}
