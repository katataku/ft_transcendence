import { type ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

function listMatches(matchList: IMatch[]): ReactElement[] {
  const navigate = useNavigate()

  return matchList.map((match): ReactElement => {
    const key = match.p1.name + match.p2.name
    return (
      <ListGroup.Item
        key={key}
        id="centerCol"
        action
        onClick={() => {
          // マッチリスト->ゲーム をナビゲートされる人のユーザー情報は必要ないです
          navigate('/Game/', { state: { id: '', name: '' } })
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
    id: 1,
    name: 'Player1',
    side: 'left',
    wins: 3,
    losses: 7,
    ready: false
  }
  const p2: IPlayer = { ...p1, name: 'Player2' }
  const p3: IPlayer = { ...p1, name: 'Player3' }
  const p4: IPlayer = { ...p1, name: 'Player4' }

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
