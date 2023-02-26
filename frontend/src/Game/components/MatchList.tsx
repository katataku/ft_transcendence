import React, { type ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

function listMatches(matches: MatchDto[], users: User[]): ReactElement[] {
  const navigate = useNavigate()

  function findUserName(id: number): string {
    const user = users.find((user) => {
      return user.id === id
    })
    return user === undefined ? '' : user.name
  }

  // まだ勝者が決まっていないマッチだけ表現
  matches = matches.filter((match) => match.winner === 0)

  return matches.map((match): ReactElement => {

    return (
      <ListGroup.Item
        key={String(match.p1) + String(match.p2)}
        id="centerCol"
        action
        onClick={() => {
          // マッチリスト->ゲーム をナビゲートされる人のユーザー情報は必要ないです
          navigate('/Game/', {
            state: { matchId: match.id, userId: '', userName: '' }
          })
        }}
      >
        {findUserName(match.p1)} vs {findUserName(match.p2)}
      </ListGroup.Item>
    )
  })
}

export function MatchList(): ReactElement {
  const [matches, setMatches] = useState<MatchDto[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    axios
      .get<MatchDto[]>('/match/matches')
      .then((response) => {
        setMatches(response.data)
      })
      .catch((err) => {
        alert(err)
      })

    axios
      .get<User[]>('/user/users')
      .then((response) => {
        setUsers(response.data)
      })
      .catch((err) => {
        alert(err)
      })
  }, [])

  return (
    <>
      <h1 id="centerCol">Ongoing Matches</h1>
      <ListGroup>{listMatches(matches, users)}</ListGroup>
    </>
  )
}
