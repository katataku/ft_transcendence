import { type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'

// TODO(takkatao): 未実装。現時点ではモーダルの表示のみ。
// ユーザを追加するモーダルを表示する。
// ユーザ一覧を取得し、チャットルームに所属していないユーザを表示する。
// ユーザを選択し、追加ボタンを押すと、チャットルームにユーザを追加する。
// チャットルームに追加したユーザは、チャットルームのメンバーとなる。
export const AddUserModal = (props: {
  showAddUserModal: boolean
  handleModalClose: () => void
}): ReactElement => {
  return (
    <>
      <Modal show={props.showAddUserModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>

        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
