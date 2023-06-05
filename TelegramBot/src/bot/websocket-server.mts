import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

import { ExchangeMessageData } from '../types'

class WebsocketServer {
  constructor(port: number) {
    const httpServer = createServer()
    const server = new Server(httpServer, {
      maxHttpBufferSize: 50 * 1024 * 1024, // the limit size of message is 50MB
      pingInterval: 50000,
      pingTimeout: 40000,
      cors: {
        origin: '*',
      },
    })

    server.on('connect', this.handleConnect)

    this.port = port
    this.server = server
  }

  private port: number

  private server: Server

  private onMessageResponseCallback = (data: ExchangeMessageData) => {}

  private handleConnect = (socket: Socket) => {
    console.log('handleConnect', socket.id)

    socket.on('disconnect', (reason) => {
      console.log('socket disconnect', reason, Date.now())
    })
    socket.on('message_response', (data: ExchangeMessageData) => {
      this.onMessageResponseCallback?.(data)
    })
  }

  sendMessageRequest = (data: ExchangeMessageData) => {
    this.server.emit('message_request', data)
  }

  onMessageResponse = (cb: (data: ExchangeMessageData) => void) => {
    this.onMessageResponseCallback = cb
  }

  start = () => {
    this.server.listen(this.port)
  }

  stop = () => {
    this.server.close()
  }
}

export default WebsocketServer
