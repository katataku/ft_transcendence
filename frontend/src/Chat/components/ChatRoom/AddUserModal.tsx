import { useEffect, useState, type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'
import {
  getAllUsersRequest,
  updateChatRoomMembersRequest
} from './requestUtils'

const AddButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  const handleUpdateChatRoomMembers = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: props.room.id,
      userId: props.member.id,
      isBanned: false,
      isAdministrator: false
    }
    updateChatRoomMembersRequest(requestData, props.updateMemberList)
  }

  return (
    <Button
      variant="outline-primary"
      onClick={() => {
        handleUpdateChatRoomMembers()
      }}
    >
      Add
    </Button>
  )
}

const ALLUserDisplay = (props: {
  room: ChatRoom
  allUserList: User[]
  userList: User[]
  updateMemberList: () => void
}): ReactElement => {
  return (
    <ul>
      {props.allUserList
        .filter(
          (member) =>
            !props.userList.map((value) => value.id).includes(member.id)
        )
        .map((member, index) => {
          return (
            <li key={index}>
              {member.name}
              <AddButton {...props} member={member} />
            </li>
          )
        })}
    </ul>
  )
}

// ユーザを追加するモーダルを表示する。
// ユーザ一覧を取得し、チャットルームに所属していないユーザを表示する。
// ユーザを選択し、追加ボタンを押すと、チャットルームにユーザを追加する。
// チャットルームに追加したユーザは、チャットルームのメンバーとなる。
export const AddUserModal = (props: {
  room: ChatRoom
  userList: User[]
  showAddUserModal: boolean
  handleModalClose: () => void
  updateMemberList: () => void
}): ReactElement => {
  const [allUserList, setALLUserList] = useState<User[]>([])

  useEffect(() => {
    // ユーザ一覧を取得する。
    getAllUsersRequest((data) => {
      setALLUserList(data)
    })
  }, [])

  return (
    <>
      <Modal show={props.showAddUserModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ALLUserDisplay {...props} allUserList={allUserList}></ALLUserDisplay>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
