import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { getChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'

export const ChatModal = (props: {
  room: ChatRoom
  showModal: boolean
  targetUser: User
  handleModalClose: () => void
  handleKickButtonClick: () => void
}): ReactElement => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { loginUser } = useContext(GlobalContext)

  useEffect(() => {
    getChatRoomMembersRequest((members: ChatRoomMember[]) => {
      members
        .filter(
          (member) =>
            member.userId === loginUser.id &&
            member.chatRoomId === props.room.id
        )
        .forEach((member) => {
          if (member.isAdministrator) {
            setIsAdmin(true)
          }
        })
    })
  }, [props.showModal])

  const kickButton = isAdmin ? (
    <Button variant="primary" onClick={props.handleKickButtonClick}>
      Kick
    </Button>
  ) : (
    <></>
  )

  return (
    <>
      <Modal show={props.showModal} onHide={props.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.targetUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
          {kickButton}
          <Button variant="primary" onClick={() => {}}>
            ゲーム
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
