import { type ReactElement, useState, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { ChatRoomContext, ChatRoomRefreshContext } from '../utils/context'
import { isOwner } from '../utils/userStatusUtils'
import { UpdateChatRoomModal } from './UpdateChatRoomModal'

// チャットルームを更新するボタンを表示する。
// ボタンを押すと、モーダルを表示する。
// モーダルを管理するためのstateを持つ。
export const UpdateRoomButton = (props: { user: User }): ReactElement => {
  const room = useContext(ChatRoomContext)
  const updateMemberList = useContext(ChatRoomRefreshContext)
  const [showUpdateRoomModal, setShowUpdateRoomModal] = useState(false)

  const handleModalClose = (): void => {
    setShowUpdateRoomModal(false)
    updateMemberList()
  }

  // チャットルームのオーナーでない場合は、ボタンを表示しない。
  if (!isOwner(props.user, room)) return <></>
  return (
    <>
      <p>
        <UpdateChatRoomModal
          {...props}
          showModal={showUpdateRoomModal}
          handleModalClose={handleModalClose}
        ></UpdateChatRoomModal>
        <Button
          onClick={() => {
            setShowUpdateRoomModal(true)
          }}
        >
          Room Settings
        </Button>
      </p>
    </>
  )
}
