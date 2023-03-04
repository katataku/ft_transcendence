import { createContext } from 'react'
import io, { type Socket } from 'socket.io-client'

const ServerURL: string = process.env.REACT_APP_BACKEND_WEBSOCKET_BASE_URL ?? ''
const gameSocket: Socket = io(ServerURL + '/game')
console.log('init socket: %s', gameSocket.id)

export const GameSocketContext = createContext<Socket>(gameSocket)
