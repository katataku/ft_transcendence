import { type ReactElement, useContext, useEffect, useState } from 'react'
import { Button, Tab, Tabs, Image } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { FriendList } from './FriendList'
import { FriendPendingList } from './FriendPendingList'
import { BaseURL } from '../../../constants'
import { getMatchHistoryById } from '../../../utils/userAxios'
import { MatchHistory } from '../../../components/MatchHistory'
import { TwoFactorRegModal } from '../../../Auth/components/TwoFactorRegModal'

function Settings(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [matchHist, setMatchHist] = useState({ wins: 0, losses: 0 })

  useEffect(() => {
    getMatchHistoryById(loginUser.id, setMatchHist)
  }, [])

  return (
    <>
      <p>
        <Image
          src={`${BaseURL}/user/user_avatar/${loginUser.id}`}
          style={{ borderRadius: '50%', margin: '30px' }}
          height={300}
        />
      </p>
      <p>
        <MatchHistory matchHistory={matchHist} />
      </p>

      <p>
        <Button>自分のプロフィールを編集できるボタンになる予定</Button>
      </p>
      <TwoFactorRegModal />
    </>
  )
}

export function MyPage(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  return (
    <>
      <h2>My page</h2>
      <p>ID : {loginUser.id}</p>
      <p>NAME: {loginUser.name}</p>

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
