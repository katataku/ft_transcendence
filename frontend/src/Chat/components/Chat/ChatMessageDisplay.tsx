import { useContext, useEffect, useState } from 'react'
import { type ReactElement } from 'react'
import { ChatModal } from './ChatModal'
import { getChatBlockUserRequest } from '../../../utils/chatBlockUserAxios'
import { GlobalContext } from '../../../App'
import { getChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { BaseURL } from '../../../constants'

// 非表示にするユーザの一覧を取得する。
// 一覧は、非表示にするユーザのIDの配列である。
// 非表示にするユーザはブロックされたユーザと、ミュートされたユーザの両方である。
const getHiddenUserList = (user: User, room: ChatRoom): number[] => {
  const [blockedUserList, setBlockedUserList] = useState<number[]>([])
  const [mutedUserList, setMuteUserList] = useState<number[]>([])
  const [hiddenUsersList, setHiddenUsersList] = useState<number[]>([])

  const isValidDate = (date: Date | undefined): boolean => {
    if (date === undefined) return false
    const now = new Date()
    const targetDate = new Date(date)
    return targetDate.getTime() > now.getTime()
  }

  const updateBlockList = (): void => {
    const callback = (data: blockUserList[]): void => {
      const newBlockedUserList = data
        .filter((item: blockUserList) => isValidDate(item.block_until))
        .map((item: blockUserList) => item.blockedUserId)

      setBlockedUserList(newBlockedUserList)
      console.log('setBlockedUserList', newBlockedUserList)
    }
    getChatBlockUserRequest(user, callback)
  }

  const updateMuteList = (): void => {
    const callback = (data: ChatRoomMember[]): void => {
      const newMutedUserList = data
        .filter((item: ChatRoomMember) => item.chatRoomId === room.id)
        .filter((item: ChatRoomMember) => isValidDate(item.mute_until))
        .map((item: ChatRoomMember) => item.userId)

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
            src={`${BaseURL}/user/user_avatar/${item.user.id}`}
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
