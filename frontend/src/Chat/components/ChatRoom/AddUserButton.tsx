import { type ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'
import { AddUserModal } from './AddUserModal'

// チャットルームにユーザを追加するボタンを表示する。
// ボタンを押すと、モーダルを表示する。
// モーダルを管理するためのstateを持つ。
export const AddUserButton = (props: {
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
