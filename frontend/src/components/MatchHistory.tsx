import React, { type ReactElement } from 'react';

export function MatchHistory(props: { matchHistory: UserMatchHistoryDto }): ReactElement {
  return (
      <div className="border">
        <h4>Match History</h4>
        <h6>
          wins:<span className="text-success">{props.matchHistory.wins} </span>
          losses:<span className="text-danger">{props.matchHistory.losses}</span>
        </h6>
      </div>
  )
}