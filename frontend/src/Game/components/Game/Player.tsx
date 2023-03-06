import React, { type ReactElement, useContext, useState } from 'react'
import { GameSocketContext } from '../../utils/gameSocketContext'
import { Col } from 'react-bootstrap'

function Ready(props: { player: IPlayer }): ReactElement {
  const greenButton = 'btn btn-success btn-lg pull bottom'
  const grayButton = 'btn btn-secondary btn-lg pull bottom'
  const [button, setButton] = useState<string>(grayButton)
  const gameSocket = useContext(GameSocketContext)

  function setReady(): void {
    if (props.player.socketID === gameSocket.id && button === grayButton) {
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

export function Player(props: { player: IPlayer }): ReactElement {
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
