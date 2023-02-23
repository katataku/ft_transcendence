import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

function listMatches(matchList: MatchDto[]): ReactElement[] {
  const navigate = useNavigate()

  return matchList.map((match): ReactElement => {
    const key = match.p1 + match.p2
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
        {match.p1} vs. {match.p2}
      </ListGroup.Item>
    )
  })
}

export function MatchList(): ReactElement {
  // === ページにリストを表示するためだけのものです === //
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

  const matchList: MatchDto[] = [
    { id: 1, p1: p1.id, p2: p2.id },
    { id: 2, p1: p3.id, p2: p4.id },
    { id: 3, p1: p4.id, p2: p1.id },
    { id: 4, p1: p3.id, p2: p3.id }
  ]
  // === ページにリストを表示するためだけのものです === //

  // TODO: Jade - ERDからゲームテーブルを実装する。
  //  ゲームロジックのテーブルは'Game'を使っているので、
  //  データベースはMatchListと呼ぶことにします。
  return <ListGroup>{listMatches(matchList)}</ListGroup>
}
