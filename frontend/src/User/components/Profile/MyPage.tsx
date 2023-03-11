import { type ReactElement, useContext, useState } from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { FriendList } from './FriendList'
import { FriendPendingList } from './FriendPendingList'
import { MatchHistory } from '../../../components/MatchHistory'
import { getMatchHistoryById } from '../../../utils/userAxios'

function Settings(): ReactElement {
  return (
    <>
      <p>ここにプロフィール画像を表示する</p>
      <p>Gameの成績・Match Historyを表示する</p>

      <p>
        <Button>自分のプロフィールを編集できるボタンになる予定</Button>
      </p>
      <p>
        <Button>2FAを有効・無効にするボタンになる予定</Button>
      </p>
    </>
  )
}

export function MyPage(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [matchHistory, setMatchHistory] = useState({ wins: 0, losses: 0 })
  getMatchHistoryById(loginUser.id, setMatchHistory)

  console.log(loginUser.id)
  return (
    <>
      <h2>My page</h2>
      <p>ID : {loginUser.id}</p>
      <p>NAME: {loginUser.name}</p>
      <MatchHistory matchHistory={matchHistory} />

      <Tabs
        defaultActiveKey="Settings"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="Settings" title="Settings">
          <Settings></Settings>
        </Tab>
        <Tab eventKey="FriendList" title="FriendList">
          <FriendList></FriendList>
        </Tab>
        <Tab eventKey="FriendPendingList" title="FriendPendingList">
          <FriendPendingList></FriendPendingList>
        </Tab>
      </Tabs>
    </>
  )
}
