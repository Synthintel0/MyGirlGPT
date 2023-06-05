import dotenv from 'dotenv'

import { ExchangeMessageData } from '../types'
import BotApp from './bot-app.mjs'
import WebsocketServer from './websocket-server.mjs'

dotenv.config()

class App {
  constructor() {
    // @ts-ignore
    const botApp = new BotApp(process.env.BOT_TOKEN)
    const websocketServer = new WebsocketServer(parseInt(process.env.WEBSOCKET_PORT as string, 10))

    botApp.onMessage(this.handleBotMessage)

    websocketServer.onMessageResponse(this.handleWebsocketMessageResponse)

    this.botApp = botApp
    this.websocketServer = websocketServer
  }

  private botApp: BotApp

  private websocketServer: WebsocketServer

  private handleBotMessage = (data: ExchangeMessageData) => {
    console.log('handleBotAppMessage', data)
    this.websocketServer.sendMessageRequest(data)
  }

  private handleWebsocketMessageResponse = (data: ExchangeMessageData) => {
    console.log('handleWebsocketMessageResponse', data.message.type, data.message.id)
    this.botApp.replyMessage(data)
  }

  start = () => {
    this.botApp?.start()
    this.websocketServer?.start()
  }

  stop = () => {
    this.botApp?.stop()
    this.websocketServer?.stop()
  }
}

process.on('unhandledRejection', (error: Error) => {
  console.log('unhandledRejection', error.message)
})

console.log('process.env', process.env)

const app = new App()
app.start()
