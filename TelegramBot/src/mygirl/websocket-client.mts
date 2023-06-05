import { Socket, io } from 'socket.io-client'

import { ExchangeMessageData } from '../types'

class WebsocketClient {
  constructor(host: string) {
    const socket = io(host, {
      protocols: ['websocket'],
    })

    socket.on('connect', this.handleConnect)
    socket.on('disconnect', this.handleDisconnect)
    socket.on('message_request', this.handleMessageRequest)

    this.socket = socket
  }

  private socket: Socket

  private handleConnect = () => {
    console.log('handleConnect')
  }

  private handleDisconnect = (e: string) => {
    console.log('handleDisconnect', e, Date.now())
  }

  private messageRequestCallback = (data: ExchangeMessageData) => {}

  private handleMessageRequest = (data: ExchangeMessageData) => {
    this.messageRequestCallback?.(data)
  }

  onMessageRequest = (cb: (data: ExchangeMessageData) => void) => {
    this.messageRequestCallback = cb
  }

  replyMessageRequest = (data: ExchangeMessageData) => {
    this.socket.emit('message_response', data)
  }

  start = () => {
    this.socket.connect()
  }

  stop = () => {
    this.socket.disconnect()
  }
}

export { WebsocketClient }
