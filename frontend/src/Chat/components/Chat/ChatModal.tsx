import { useContext, useEffect, useState, type ReactElement } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { GlobalContext } from '../../../App'
import { getChatRoomMembersRequest } from '../../../utils/chatRoomMemberAxios'
import { useNavigate } from 'react-router-dom'

export const ChatModal = (props: {
  room: ChatRoom
  showModal: boolean
  targetUser: User
  handleModalClose: () => void
  handleKickButtonClick: () => void
  handleInviteButtonClick: () => void
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
  const navigate = useNavigate()

  const handleNavigateToProfile = (): void => {
    navigate('/profile/' + String(props.targetUser.id))
  }

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
          <Button variant="primary" onClick={handleNavigateToProfile}>
            プロフィール
          </Button>
          {kickButton}
          <Button variant="primary" onClick={props.handleInviteButtonClick}>
            ゲーム
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
