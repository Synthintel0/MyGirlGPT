export interface ExchangeMessageData {
  user: {
    id: string
  }
  chat: {
    id: string
  }
  message: {
    type: 'text' | 'image' | 'voice' | 'command'
    content: string
    id: string
  }
  options?: {
    voice: boolean
  }
}

export interface GPTResponseData {
  content: string
  imageBase64: string
}
