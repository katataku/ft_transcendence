import { useEffect, useState, type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'
import {
  getAllUsersRequest,
  getUserRequest,
  updateChatRoomMembersRequest
} from '../utils/requestUtils'

const AddButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  const handleUpdateChatRoomMembers = (): void => {
    const requestData: ChatRoomMember = {
      chatRoomId: props.room.id,
      userId: props.member.id,
      ban_until: undefined,
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
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): ReactElement => {
  const [allUserList, setALLUserList] = useState<User[]>([])
  const [userList, setUserList] = useState<User[]>([])

  // チャットルームに所属しているユーザーのリストを取得する。
  const updateMemberList = (): void => {
    setUserList([])
    props.chatRoomMemberList.map(async (value: ChatRoomMember) => {
      getUserRequest(value.userId, (data) => {
        setUserList(
          (userList) =>
            [...userList, data]
              .sort((a, b) => a.id - b.id)
              .filter(
                (element, index, arr) =>
                  arr.map((value) => value.id).indexOf(element.id) === index
              ) // 重複削除
        )
      })
    })
  }

  useEffect(() => {
    updateMemberList()
  }, [props.chatRoomMemberList])

  useEffect(() => {
    // ユーザ一覧を取得する。
    getAllUsersRequest((data) => {
      setALLUserList(data)
    })
  }, [])

  return (
    <ul>
      {allUserList
        .filter(
          (member) => !userList.map((value) => value.id).includes(member.id)
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
  showAddUserModal: boolean
  chatRoomMemberList: ChatRoomMember[]
  handleModalClose: () => void
  updateMemberList: () => void
}): ReactElement => {
  return (
    <>
      <Modal show={props.showAddUserModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ALLUserDisplay {...props}></ALLUserDisplay>
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
