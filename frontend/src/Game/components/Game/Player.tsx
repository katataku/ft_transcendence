import React, { type ReactElement, useContext, useState } from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Col } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { MatchHistory } from '../../../components/MatchHistory'

function Ready(props: { matchID: number; player: IPlayer }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-outline-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)
  const gameSocket = useContext(GameSocketContext)
  const { loginUser } = useContext(GlobalContext)

  function setReady(): void {
    if (props.player.name === loginUser.name && button === grayButton) {
      gameSocket.emit('updatePlayerReady', {
        matchID: props.matchID,
        userName: props.player.name
      })
    }
  }

  if (button === grayButton && props.player.ready) setButton(greenButton)

  return (
    <button type="button" className={button} onClick={setReady}>
      Ready
    </button>
  )
}

export function Player(props: {
  matchID: number
  player: IPlayer
}): ReactElement {
  return (
    <Col>
      <div className="display-4">
        {props.player.name.slice(0, 7)}&emsp;
        <Ready matchID={props.matchID} player={props.player} />
      </div>
      <div className="border">
        <MatchHistory matchHistory={props.player.matchHistory} />
      </div>
    </Col>
  )
}
