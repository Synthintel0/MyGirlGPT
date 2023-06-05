import _ from 'lodash'
import dotenv from 'dotenv'

import { ExchangeMessageData, GPTResponseData } from '../types/index.js'
import { chatGPTAPI } from './chatgpt-api.mjs'
import { WebsocketClient } from './websocket-client.mjs'
import { textToVoice } from './text-to-voice.mjs'
import PromiseQueue from '../utils/promise-queue.mjs'
import { splitParagraphToShorterParts } from '../utils/text.mjs'

dotenv.config()

class App {
  constructor() {
    // @ts-ignore
    const websocketClient = new WebsocketClient(process.env.WEBSOCKET_SERVER)

    websocketClient.onMessageRequest(this.handleMessageRequest)

    this.websocketClient = websocketClient
  }

  private websocketClient: WebsocketClient

  private parentMessageIds: Map<string, string> = new Map()

  private handleMessageRequest = (data: ExchangeMessageData) => {
    console.log('handleMessageRequest', data)
    if (data.message.type === 'command') {
      if (data.message.content === 'reset') {
        const parentMessageId = this.parentMessageIds.get(data.chat.id)
        if (parentMessageId !== undefined) {
          chatGPTAPI.resetSession(parentMessageId)
        }
      }
    } else if (data.message.type === 'text') {
      chatGPTAPI
        .sendMessage(data.message.content, {
          parentMessageId: this.parentMessageIds.get(data.chat.id),
          completionParams: {
            temperature: 0.5,
            top_p: 0.73,
            presence_penalty: 1.1,
          },
        })
        .then((result) => {
          console.log('chatGPTAPI.sendMessage result', result)
          this.parentMessageIds.set(data.chat.id, result.id)

          const { content: textContent, imageBase64: imageContent } = JSON.parse(result.text) as GPTResponseData
          const textContentParts = splitParagraphToShorterParts(textContent)
          const queue = new PromiseQueue()

          textContentParts.forEach((part) => {
            queue.add(async () => {
              if (data.options?.voice !== true) {
                // reply text
                this.websocketClient.replyMessageRequest({
                  user: data.user,
                  chat: data.chat,
                  message: {
                    type: 'text',
                    content: part,
                    id: data.message.id,
                  },
                  options: data.options,
                })
              } else {
                const prunedContent = part.replace(/\*.*?\*/g, '').trim()
                const voiceData = await textToVoice(prunedContent).catch(() => {})
                // reply text
                this.websocketClient.replyMessageRequest({
                  user: data.user,
                  chat: data.chat,
                  message: {
                    type: 'text',
                    content: part,
                    id: data.message.id,
                  },
                  options: data.options,
                })
                if (voiceData !== undefined) {
                  // reply voice
                  this.websocketClient.replyMessageRequest({
                    user: data.user,
                    chat: data.chat,
                    message: {
                      type: 'voice',
                      content: voiceData,
                      id: data.message.id,
                    },
                    options: data.options,
                  })
                }
              }
            })
          })

          if (imageContent !== '') {
            queue.add(async () => {
              // reply image
              this.websocketClient.replyMessageRequest({
                user: data.user,
                chat: data.chat,
                message: {
                  type: 'image',
                  content: imageContent,
                  id: data.message.id,
                },
                options: data.options,
              })
            })
          }
        })
        .catch((e) => {
          console.log('chatGPTAPI.sendMessage error', e)
        })
    }
  }

  start = () => {
    this.websocketClient?.start()
  }

  stop = () => {
    this.websocketClient?.stop()
  }
}

process.on('unhandledRejection', (error: Error) => {
  console.log('unhandledRejection', error.message)
})

console.log('process.env', process.env)

const app = new App()
app.start()
