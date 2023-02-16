import React, { useEffect, useState } from 'react'
import '../assets/styles.css'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap'

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const socket = io(ServerURL)

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

const MessageDisplay = (props: {
  itemList: messageItem[]
  mutedUserList: muteUserList[]
}): ReactElement => {
  const mutedUserStringList = props.mutedUserList.map(
    (value) => value.mutedUserId
  )
  return (
    <>
      <div className="line__container">
        <div className="line__contents">
          {props.itemList
            .filter((value) => !mutedUserStringList.includes(value.name))
            .map((value) => value.body)}
        </div>
      </div>
    </>
  )
}

const MessageSending = (props: {
  name: string
  room: string
}): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const clickSendMessage = (msg: string): void => {
    console.log('clicked')

    const obj: messageEventType = {
      key: Date.now(),
      name: props.name,
      room: props.room,
      msg
    }
    const sendMsg: string = JSON.stringify(obj)
    socket.emit('message', obj)
    console.log('message sent:' + sendMsg)
    setMessage('')
  }

  return (
    <>
      <label>
        Message:
        <input
          name="message"
          value={message}
          type="text"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
      </label>
      <button
        onClick={() => {
          if (message !== null) clickSendMessage(message)
        }}
      >
        send
      </button>
    </>
  )
}

const UserSettingModal = (props: {
  showModal: boolean
  targetUser: string
  handleModalClose: () => void
  handleKickButtonClick: () => void
  handleMuteButtonClick: ({ muteSec }: { muteSec: number }) => void
}): ReactElement => {
  return (
    <>
      <Modal show={props.showModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.targetUser}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.handleKickButtonClick}>
            Kick
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.handleMuteButtonClick({ muteSec: 0 })
            }}
          >
            Mute
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.handleMuteButtonClick({ muteSec: 10 })
            }}
          >
            Mute 10sec
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export function Chat(): ReactElement {
  const [itemList, setItemList] = useState<messageItem[]>([])
  const [mutedUserList, setMutedUserList] = useState<muteUserList[]>([])
  const [showModal, setShowModal] = useState(false)
  const [targetUser, setTargetUser] = useState<string>('')

  const { room, name }: ChatState = useLocation().state
  const navigate = useNavigate()

  const updateMuteList = (): void => {
    const now = new Date()
    axios
      .get('/chat-mute-user/' + name)
      .then((response) => {
        setMutedUserList(
          response.data
            .map((value: muteUserList) => {
              value.mute_until = new Date(value.mute_until)
              return value
            })
            .filter(
              (item: muteUserList) => item.mute_until.getTime() > now.getTime()
            )
        )
      })
      .catch(() => {
        alert('エラーです！')
      })
  }
  useEffect(() => {
    updateMuteList()
  }, [])

  const handleMuteButtonClick = ({ muteSec }: { muteSec: number }): void => {
    let ts: Date
    if (muteSec === 0) {
      ts = new Date(2023, 12, 31, 23, 59, 0)
    } else {
      ts = new Date(Date.now() + muteSec * 1000)
    }

    const newMuteUser: muteUserList = {
      muteUserId: name,
      mutedUserId: targetUser,
      mute_until: ts
    }

    axios
      .post<muteUserList>('/chat-mute-user', newMuteUser)
      .then((_response) => {
        console.log('mute requested')
        updateMuteList()
        setShowModal(false)
      })
      .catch((reason) => {
        alert('エラーです！')
        console.log(reason)
      })
  }

  const handleKickButtonClick = (): void => {
    const sendMsg: kickEventType = {
      key: Date.now(),
      name: targetUser,
      room
    }
    socket.emit('kickNotification', sendMsg)
    setShowModal(false)
  }

  const makeItem = (item: messageEventType): messageItem => {
    // 暫定的にいらすとやのURLを設定している。
    // 将来的にはプロフィール画像の設定されている42CDNのURLを設定する。
    const imageURL: string =
      'https://1.bp.blogspot.com/-SWOiphrHWnI/XWS5x7MYwHI/AAAAAAABUXA/i_PRL_Atr08ayl9sZy9-x0uoY4zV2d5xwCLcBGAs/s1600/pose_dance_ukareru_man.png'
    const outerClassName: string =
      name === item.name ? 'line__right' : 'line__left'
    const innerClassName: string =
      name === item.name ? 'line__right-text' : 'line__left-text'
    const imageObject: JSX.Element =
      name === item.name ? (
        <></>
      ) : (
        <figure>
          <img
            src={imageURL}
            onClick={() => {
              setTargetUser(item.name)
              setShowModal(true)
            }}
          />
        </figure>
      )

    return {
      name: item.name,
      body: (
        <div className={outerClassName} key={item.key}>
          {imageObject}
          <div className={innerClassName}>
            <div className="name">{item.name}</div>
            <div className="text">{item.msg}</div>
          </div>
        </div>
      )
    }
  }

  const handleConnectEvent = (): void => {
    console.log('socket connected.')
  }

  const handleMessageEvent = (data: messageEventType): void => {
    console.log('message received:' + JSON.stringify(data))
    if (data.room === room) {
      setItemList((itemList) => [...itemList, makeItem(data)])
    }
  }

  const handleKickEvent = (item: kickEventType): void => {
    console.log('kick received:' + JSON.stringify(item))
    const ChatListState: ChatListState = { kicked: true }
    if (item.room === room && item.name === name) {
      navigate('/chatlist', { state: ChatListState })
    }
  }

  useEffect(() => {
    socket.on('connect', handleConnectEvent)
    socket.on('message', handleMessageEvent)
    socket.on('kickNotification', handleKickEvent)
    socket.emit('channelNotification', room)

    return () => {
      socket.off('connect')
      socket.off('message')
      socket.off('kickNotification')
    }
  }, [])

  const handleModalClose = (): void => {
    setShowModal(false)
  }

  const StateInfo = (): ReactElement => {
    const mutedUserStringList = mutedUserList.map((value) => value.mutedUserId)
    return (
      <>
        <p>user name: {name}</p>
        <p>room: {room}</p>
        <p>muted user: {mutedUserStringList.join(', ')}</p>
      </>
    )
  }

  return (
    <>
      <div className="Chat">
        <UserSettingModal
          showModal={showModal}
          targetUser={targetUser}
          handleModalClose={handleModalClose}
          handleKickButtonClick={handleKickButtonClick}
          handleMuteButtonClick={handleMuteButtonClick}
        ></UserSettingModal>
        <h1>Chat Page</h1>
        <StateInfo></StateInfo>
        <MessageDisplay
          itemList={itemList}
          mutedUserList={mutedUserList}
        ></MessageDisplay>
        <MessageSending name={name} room={room}></MessageSending>
        <Button variant="primary" onClick={updateMuteList}>
          update MuteList
        </Button>
      </div>
    </>
  )
}
