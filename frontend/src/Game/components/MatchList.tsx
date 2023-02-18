import {type JSXElementConstructor, type ReactElement, useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup';

function listMatches(matchList: IMatch[]): ReactElement[] {
  return (
    matchList.map((match): ReactElement => {
      return (
        <ListGroup.Item key="idk" id="centerCol" action onClick={log}>
          {match.p1.name} vs. {match.p2.name}
        </ListGroup.Item>
        )
    })
  )
}

export function MatchList(): ReactElement {
  const p1 = {
    id: 1,
    name: 'Player1',
    wins: 3,
    losses: 7,
    ready: false
  }
  const p2 = {
    id: 2,
    name: 'Player2',
    wins: 13,
    losses: 17,
    ready: false
  }
  const p3 = {...p1, id:3, name: 'Player3'}
  const p4 = {...p1, id:4, name: 'Player4'}

  const matchList: IMatch[] = [{p1, p2}, {p1: p3, p2: p4}, {p1: p4, p2: p1}, {p1: p3, p2: p3}]

  return (
    <ListGroup>{listMatches(matchList)}</ListGroup>
  )
}

function log(): void {
  console.log('str')
}