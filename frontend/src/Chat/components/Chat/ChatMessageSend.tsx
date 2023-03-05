import { type ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'

export const MessageSend = (props: {
  room: string
  sendMessageEvent: (msg: string) => void
}): ReactElement => {
  const [message, setMessage] = useState<string>('')

  const clickSendMessage = (msg: string): void => {
    console.log('clicked')
    props.sendMessageEvent(msg)
    setMessage('')
  }

  return (
    <>
      <label>
        Message:
        <input
          name="message"
          value={message}
          type="text"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
      </label>
      <Button
        onClick={() => {
          if (message !== null) clickSendMessage(message)
        }}
      >
        send
      </Button>
    </>
  )
}
