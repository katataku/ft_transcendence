import { type ReactElement, useContext, useEffect, useState } from 'react'
import { Button, Tab, Tabs, Image, Modal, Form } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { FriendList } from './FriendList'
import { FriendPendingList } from './FriendPendingList'
import { BaseURL } from '../../../constants'
import {
  getMatchHistoryById,
  updateAvatar,
  updateUserProfile
} from '../../../utils/userAxios'
import { MatchHistory } from '../../../components/MatchHistory'
import { TwoFactorRegModal } from '../../../Auth/components/TwoFactorRegModal'
import { resizeAndEncode } from '../../functions/user.functions'
import { defaultAvatar } from '../SignIn'

function UserProfileModal(props: {
  show: boolean
  handleClose: () => void
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)

  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>プロフィールの変更</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder={'UserName'}
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
          <Form.Control
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <Form.Check
            type="switch"
            label="show"
            style={{ width: '100px' }}
            onChange={() => {
              setShowPassword(!showPassword)
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            閉じる
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateUserProfile(loginUser.id, userName, password, (_res) => {
                alert('プロフィールを変更しました。')
              })
              props.handleClose()
            }}
          >
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function AvatarUpdateModal(props: {
  show: boolean
  handleClose: () => void
}): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [image, setImage] = useState<string>(defaultAvatar)

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>プロフィール画像の変更</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>プロフィール画像のURL</Form.Label>
              <Form.Control
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0] as File
                  resizeAndEncode(file)
                    .then((res) => {
                      setImage(res)
                    })
                    .catch((err) => {
                      console.error(err)
                      alert('Only .png is accepted.')
                      setImage('')
                    })
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            閉じる
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              setImage(defaultAvatar)
            }}
          >
            画像をクリア
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateAvatar(loginUser.id, image, (_res) => {
                props.handleClose()
                alert('プロフィール画像を変更しました。')
              })
            }}
          >
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function Settings(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [matchHist, setMatchHist] = useState({ wins: 0, losses: 0 })
  const [avatarModalShow, setAvatarModalShow] = useState(false)
  const [userprofileModalShow, setUserprofileModalShow] = useState(false)

  useEffect(() => {
    getMatchHistoryById(loginUser.id, setMatchHist)
  }, [])

  return (
    <>
      <AvatarUpdateModal
        show={avatarModalShow}
        handleClose={() => {
          setAvatarModalShow(false)
        }}
      />
      <UserProfileModal
        show={userprofileModalShow}
        handleClose={() => {
          setUserprofileModalShow(false)
        }}
      />
      ↓イメージをクリックするとプロフィール画像を変更できます。
      <p>
        <Image
          src={`${BaseURL}/user/user_avatar/${loginUser.id}`}
          style={{ borderRadius: '50%', margin: '30px' }}
          height={300}
          onClick={() => {
            setAvatarModalShow(true)
          }}
        />
      </p>
      <p>
        <MatchHistory matchHistory={matchHist} />
      </p>
      <p>
        <Button
          onClick={() => {
            setUserprofileModalShow(true)
          }}
        >
          Username/Passwordを変更
        </Button>
      </p>
      <TwoFactorRegModal />
    </>
  )
}

export function MyPage(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [activeTab, setActiveTab] = useState<string>('Settings')

  const handleTabSelect = (selectedTab: string | null): void => {
    setActiveTab(selectedTab ?? '')
  }

  return (
    <>
      <h2>My page</h2>
      <p>ID : {loginUser.id}</p>
      <p>NAME: {loginUser.name}</p>

      <Tabs
        defaultActiveKey="Settings"
        id="uncontrolled-tab-example"
        className="mb-3"
        onSelect={handleTabSelect}
      >
        <Tab eventKey="Settings" title="Settings">
          <Settings></Settings>
        </Tab>
        <Tab eventKey="FriendList" title="FriendList">
          <FriendList activeTab={activeTab}></FriendList>
        </Tab>
        <Tab eventKey="FriendPendingList" title="FriendPendingList">
          <FriendPendingList></FriendPendingList>
        </Tab>
      </Tabs>
    </>
  )
}
