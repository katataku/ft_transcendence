import { type ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'
import { AddUserModal } from './AddUserModal'

// チャットルームにユーザを追加するボタンを表示する。
// ボタンを押すと、モーダルを表示する。
// モーダルを管理するためのstateを持つ。
export const AddUserButton = (props: {
  room: ChatRoom
  userList: User[]
  updateMemberList: () => void
}): ReactElement => {
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  const handleModalClose = (): void => {
    setShowAddUserModal(false)
    props.updateMemberList()
  }

  return (
    <>
      <p>
        <AddUserModal
          room={props.room}
          userList={props.userList}
          showAddUserModal={showAddUserModal}
          handleModalClose={handleModalClose}
          updateMemberList={props.updateMemberList}
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
