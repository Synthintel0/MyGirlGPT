import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'
import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt'
import dotenv from 'dotenv'
import KeyvRedis from '@keyv/redis'
import Keyv from 'keyv'
import QuickLRU from 'quick-lru'
import _ from 'lodash'

dotenv.config()

const API_BASE_URL = process.env.GPT_SERVER as string
const REDIS_URL =  process.env.REDIS_SERVER as string

// The purpose of wrapping the API is to process the message structure returned by the backend GPT. 
//The data returned is a JSON string, but the chatgpt library only needs the content field inside the JSON string. 
//Therefore, the request needs to be intercepted.
export class ChatGPTAPIWrapper {
  constructor() {
    let kvStore: KeyvRedis | QuickLRU<any, any>
    if (REDIS_URL !== undefined && _.startsWith(REDIS_URL, 'redis://')) {
      kvStore = new KeyvRedis(REDIS_URL)
    } else {
      kvStore = new QuickLRU<string, any>({ maxSize: 10000 })
    }
    let messageStore = new Keyv({ store: kvStore, namespace: 'MyGirlGPT-chatHistory' })
  
    this.api = new ChatGPTAPI({
      apiKey: 'sk-test',
      apiBaseUrl: API_BASE_URL,
      systemMessage: '',
      messageStore: messageStore,
      fetch: async (url: URL | RequestInfo, init?: RequestInit) => {
        console.log('chatgptapi.sendMessage fetch args', url, init)
        return this.fetches.pop()?.(url, init)
      },
    })
  }

  private fetches: ((url: URL | RequestInfo, init?: RequestInit) => Promise<Response>)[] = []

  private api: ChatGPTAPI | undefined

  sendMessage = async (text: string, opts?: SendMessageOptions): Promise<ChatMessage> => {
    let messageContent = '' // Store the actual content returned by GPT 
    return new Promise((resolve, reject) => {
      this.fetches.push(async (url: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
        // @ts-ignore
        return fetch(url, init)
          .then((res) => {
            const _json = res.json
            res.json = () => {
              return new Promise((rs) => {
                _json
                  .call(res)
                  .then((data) => {
                    // console.log('chatgptapi.sendMessage fetch result data', data)
                    // @ts-ignore
                    messageContent = data.choices[0].message.content
                    // @ts-ignore
                    data.choices[0].message.content = JSON.parse(data.choices[0].message.content).content
                    rs(data)
                  })
                  .catch(() => {})
              })
            }
            return res
          })
          .catch(reject)
      })
      this.api
        ?.sendMessage(text, opts)
        .then((result) => {
          // Fill in the content returned by GPT (JSON string).
          result.text = messageContent
          resolve(result)
        })
        .catch(reject)
    })
  }

  resetSession = async (messageId: string) => {
    // @ts-ignore
    const messageStore = this.api._messageStore
    let currentMessageId = messageId
    while (true) {
      const currentMessage = await messageStore.get(currentMessageId)
      if (currentMessage === undefined) {
        break
      }
      await messageStore.delete(currentMessageId)
      if (currentMessage.parentMessageId === undefined) {
        break
      }
      currentMessageId = currentMessage.parentMessageId
    }
  }
}

const chatGPTAPI = new ChatGPTAPIWrapper()
export { chatGPTAPI }
