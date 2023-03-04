import { useContext, useEffect, useState } from 'react'
import { type ReactElement } from 'react'
import { ChatModal } from './ChatModal'
import { getChatBlockUserRequest } from '../../../utils/chatBlockUserAxios'
import { GlobalContext } from '../../../App'
import { getChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'

// 非表示にするユーザの一覧を取得する。
// 一覧は、非表示にするユーザのIDの配列である。
// 非表示にするユーザはブロックされたユーザと、ミュートされたユーザの両方である。
// TODO: ミュートされたユーザの一覧を取得する。
const getHiddenUserList = (user: User, room: ChatRoom): number[] => {
  const [blockedUserList, setBlockedUserList] = useState<number[]>([])
  const [mutedUserList, setMuteUserList] = useState<number[]>([])
  const [hiddenUsersList, setHiddenUsersList] = useState<number[]>([])

  const updateBlockList = (): void => {
    const callback = (data: blockUserList[]): void => {
      const now = new Date()
      const newBlockedUserList = data
        .filter((value: blockUserList) => {
          const blockUntil = new Date(value.block_until)
          return blockUntil.getTime() > now.getTime()
        })
        .map((item) => item.blockedUserId)

      setBlockedUserList(newBlockedUserList)
      console.log('setBlockedUserList', newBlockedUserList)
    }
    getChatBlockUserRequest(user, callback)
  }

  const updateMuteList = (): void => {
    const callback = (data: ChatRoomMember[]): void => {
      const now = new Date()
      const newMutedUserList = data
        .filter((value: ChatRoomMember) => value.chatRoomId === room.id)
        .filter((value: ChatRoomMember) => {
          if (value.mute_until === undefined) return false
          const muteUntil = new Date(value.mute_until)
          return muteUntil.getTime() > now.getTime()
        })
        .map((item) => item.userId)

      setMuteUserList(newMutedUserList)
      console.log('setMutedUserList', newMutedUserList)
    }
    getChatRoomMembersRequest(callback)
  }

  useEffect(() => {
    updateBlockList()
    updateMuteList()
  }, [])

  useEffect(() => {
    setHiddenUsersList([...blockedUserList, ...mutedUserList])
  }, [blockedUserList, mutedUserList])

  console.log('hiddenUserList', hiddenUsersList)

  return hiddenUsersList
}

export const MessageDisplay = (props: {
  room: ChatRoom
  messageEventList: messageEventType[]
  SendKickEvent: (userId: number) => void
}): ReactElement => {
  const { loginUser } = useContext(GlobalContext)
  const [showModal, setShowModal] = useState(false)
  const [targetUser, setTargetUser] = useState<User>({ id: 0, name: '' })

  const handleModalClose = (): void => {
    setShowModal(false)
  }

  const handleKickButtonClick = (): void => {
    props.SendKickEvent(targetUser.id)
    setShowModal(false)
  }

  const makeItem = (item: messageEventType): messageItem => {
    // 暫定的にいらすとやのURLを設定している。
    // 将来的にはプロフィール画像の設定されている42CDNのURLを設定する。
    const imageURL: string =
      'https://1.bp.blogspot.com/-SWOiphrHWnI/XWS5x7MYwHI/AAAAAAABUXA/i_PRL_Atr08ayl9sZy9-x0uoY4zV2d5xwCLcBGAs/s1600/pose_dance_ukareru_man.png'
    const outerClassName: string =
      loginUser.id === item.user.id ? 'line__right' : 'line__left'
    const innerClassName: string =
      loginUser.id === item.user.id ? 'line__right-text' : 'line__left-text'
    const imageObject: JSX.Element =
      loginUser.id === item.user.id ? (
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

  const hiddenUserList: number[] = getHiddenUserList(loginUser, props.room)
  return (
    <>
      <ChatModal
        showModal={showModal}
        targetUser={targetUser}
        handleModalClose={handleModalClose}
        handleKickButtonClick={handleKickButtonClick}
      ></ChatModal>
      <div className="line__container">
        <div className="line__contents">
          {props.messageEventList
            .map((event) => makeItem(event))
            .filter((value) => !hiddenUserList.includes(value.user.id))
            .map((value) => value.body)}
        </div>
      </div>
    </>
  )
}
