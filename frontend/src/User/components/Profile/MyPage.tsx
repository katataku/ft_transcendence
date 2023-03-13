import { type ReactElement, useContext } from 'react'
import { Button, Tab, Tabs, Image } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { FriendList } from './FriendList'
import { FriendPendingList } from './FriendPendingList'
import { BaseURL } from '../../../constants'

function Settings(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  return (
    <>
      <p>
        <Image
          src={`${BaseURL}/user/user_avatar/${loginUser.id}`}
          style={{ borderRadius: '50%', margin: '30px' }}
          height={300}
        />
      </p>
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
