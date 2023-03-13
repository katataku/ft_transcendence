import { type ReactElement, useContext, useEffect } from 'react'
import { GlobalContext } from './App'
import { GameSocketContext } from './Game/utils/gameSocketContext'
import { toast, ToastContainer } from 'react-toastify'
import { Button } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

function GameContent(props: { inviterName: string }): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const gameSocket = useContext(GameSocketContext)

  const handleAccept = (): void => {
    gameSocket.emit('inviteAccepted', {
      inviter: props.inviterName,
      invitee: loginUser.name
    })
  }

  return (
    <div className="game-invitation-notification">
      <div className="header" style={{ borderBottom: '1px solid #ccc' }}>
        <div className="from">{props.inviterName}</div>
        <div className="message">has invited you to play a game.</div>
      </div>

      <div className="text-center" style={{ paddingTop: '10px' }}>
        <Button
          variant="success"
          style={{ color: 'white' }}
          onClick={handleAccept}
        >
          Accept
        </Button>
      </div>
    </div>
  )
}

export function Notification(): ReactElement {
  const gameSocket = useContext(GameSocketContext)
  const navigate = useNavigate()

  useEffect(() => {
    gameSocket.on('navigate', () => {
      navigate('/Game')
    })
    gameSocket.on('inviteMatching', (inviter: string) => {
      toast(<GameContent inviterName={inviter} />)
    })

    return () => {
      gameSocket.off('navigate')
      gameSocket.off('inviteMatching')
    }
  }, [])

  return (
    <div>
      <ToastContainer position="top-right" theme="light" />
    </div>
  )
}
