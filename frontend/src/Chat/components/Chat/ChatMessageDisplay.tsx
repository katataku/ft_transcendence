import { useEffect, useState } from 'react'
import { type ReactElement } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { ChatModal } from './ChatModal'

export const MessageDisplay = (props: {
  user: User
  room: string
  messageEventList: messageEventType[]
  SendKickEvent: (userId: number) => void
}): ReactElement => {
  const [showModal, setShowModal] = useState(false)
  const [targetUser, setTargetUser] = useState<User>({ id: 0, name: '' })
  const [mutedUserList, setMutedUserList] = useState<muteUserList[]>([])

  const updateMuteList = (): void => {
    const now = new Date()
    axios
      .get('/chat-mute-user/' + String(props.user.id))
      .then((response) => {
        const newMusedUserList = response.data
          .map((value: muteUserList) => {
            value.mute_until = new Date(value.mute_until)
            return value
          })
          .filter(
            (item: muteUserList) => item.mute_until.getTime() > now.getTime()
          )

        setMutedUserList(newMusedUserList)
        console.log('mutedUserList : ' + JSON.stringify(newMusedUserList))
      })
      .catch(() => {
        alert('エラーです！')
      })
  }
  useEffect(() => {
    updateMuteList()
  }, [])

  const handleModalClose = (): void => {
    setShowModal(false)
  }

  const handleKickButtonClick = (): void => {
    props.SendKickEvent(targetUser.id)
    setShowModal(false)
  }

  const handleMuteButtonClick = ({ muteSec }: { muteSec: number }): void => {
    let ts: Date
    if (muteSec === 0) {
      ts = new Date(2023, 12, 31, 23, 59, 0)
    } else {
      ts = new Date(Date.now() + muteSec * 1000)
    }

    const newMuteUser: muteUserList = {
      muteUserId: props.user.id,
      mutedUserId: targetUser.id,
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

  const makeItem = (item: messageEventType): messageItem => {
    // 暫定的にいらすとやのURLを設定している。
    // 将来的にはプロフィール画像の設定されている42CDNのURLを設定する。
    const imageURL: string =
      'https://1.bp.blogspot.com/-SWOiphrHWnI/XWS5x7MYwHI/AAAAAAABUXA/i_PRL_Atr08ayl9sZy9-x0uoY4zV2d5xwCLcBGAs/s1600/pose_dance_ukareru_man.png'
    const outerClassName: string =
      props.user.id === item.user.id ? 'line__right' : 'line__left'
    const innerClassName: string =
      props.user.id === item.user.id ? 'line__right-text' : 'line__left-text'
    const imageObject: JSX.Element =
      props.user.id === item.user.id ? (
        <></>
      ) : (
        <figure>
          <img
            src={imageURL}
            onClick={() => {
              setTargetUser(item.user)
              setShowModal(true)
            }}
          />
        </figure>
      )

    return {
      user: item.user,
      body: (
        <div className={outerClassName} key={item.key}>
          {imageObject}
          <div className={innerClassName}>
            <div className="name">{item.user.name}</div>
            <div className="text">{item.msg}</div>
          </div>
        </div>
      )
    }
  }

  const mutedUserStringList = mutedUserList.map((value) => value.mutedUserId)
  return (
    <>
      <ChatModal
        showModal={showModal}
        targetUser={targetUser}
        handleModalClose={handleModalClose}
        handleKickButtonClick={handleKickButtonClick}
        handleMuteButtonClick={handleMuteButtonClick}
      ></ChatModal>
      <Button variant="primary" onClick={updateMuteList}>
        update MuteList
      </Button>
      <div className="line__container">
        <div className="line__contents">
          {props.messageEventList
            .map((event) => makeItem(event))
            .filter((value) => !mutedUserStringList.includes(value.user.id))
            .map((value) => value.body)}
        </div>
      </div>
    </>
  )
}
