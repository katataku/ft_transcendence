import { type ReactElement, useState, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { ChatRoomRefreshContext } from '../utils/context'
import { AddUserModal } from './AddUserModal'

// チャットルームにユーザを追加するボタンを表示する。
// ボタンを押すと、モーダルを表示する。
// モーダルを管理するためのstateを持つ。
export const AddUserButton = (props: {
  chatRoomMemberList: ChatRoomMember[]
}): ReactElement => {
  const updateMemberList = useContext(ChatRoomRefreshContext)
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  const handleModalClose = (): void => {
    setShowAddUserModal(false)
    updateMemberList()
  }

  return (
    <>
      <p>
        <AddUserModal
          {...props}
          showAddUserModal={showAddUserModal}
          handleModalClose={handleModalClose}
        ></AddUserModal>
        <Button
          onClick={() => {
            setShowAddUserModal(true)
          }}
        >
          Add User
        </Button>
      </p>
    </>
  )
}
