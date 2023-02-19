import { type ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

function listMatches(matchList: IMatch[]): ReactElement[] {
  const navigate = useNavigate()
  const user = useLocation().state

  return matchList.map((match): ReactElement => {
    const key = match.p1.name + match.p2.name
    return (
      <ListGroup.Item
        key={key}
        id="centerCol"
        action
        onClick={() => {
          navigate('/Game/', { state: user })
        }}
      >
        {match.p1.name} vs. {match.p2.name}
      </ListGroup.Item>
    )
  })
}

export function MatchList(): ReactElement {
  // === ページにリストを表示するためだけのもです === //
  const p1: IPlayer = {
    id: 'left',
    name: 'Player1',
    wins: 3,
    losses: 7,
    ready: false
  }
  const p2: IPlayer = {
    id: 'right',
    name: 'Player2',
    wins: 13,
    losses: 17,
    ready: false
  }
  const p3: IPlayer = { ...p1, id: 'left', name: 'Player3' }
  const p4: IPlayer = { ...p1, id: 'right', name: 'Player4' }

  const matchList: IMatch[] = [
    { p1, p2 },
    { p1: p3, p2: p4 },
    { p1: p4, p2: p1 },
    { p1: p3, p2: p3 }
  ]
  // === ページにリストを表示するためだけのもです === //

  // TODO: Jade - ERDからゲームテーブルを実装する。
  //  ゲームロジックのテーブルは'Game'を使っているので、
  //  データベースはMatchListと呼ぶことにします。
  return <ListGroup>{listMatches(matchList)}</ListGroup>
}
