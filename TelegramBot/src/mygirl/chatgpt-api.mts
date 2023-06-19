import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'
import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt'
import dotenv from 'dotenv'

dotenv.config()

const API_BASE_URL = process.env.GPT_SERVER as string

// The purpose of wrapping the API is to process the message structure returned by the backend GPT. 
//The data returned is a JSON string, but the chatgpt library only needs the content field inside the JSON string. 
//Therefore, the request needs to be intercepted.
export class ChatGPTAPIWrapper {
  private fetches: ((url: URL | RequestInfo, init?: RequestInit) => Promise<Response>)[] = []

  private api = new ChatGPTAPI({
    apiKey: 'sk-test',
    apiBaseUrl: API_BASE_URL,
    systemMessage: '',
    fetch: async (url: URL | RequestInfo, init?: RequestInit) => {
      console.log('chatgptapi.sendMessage fetch args', url, init)
      return this.fetches.pop()?.(url, init)
    },
  })

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
        .sendMessage(text, opts)
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
