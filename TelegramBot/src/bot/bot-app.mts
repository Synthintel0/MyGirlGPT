import { Bot, Context, InputFile } from 'grammy'
import { FileFlavor, hydrateFiles } from '@grammyjs/files'
import { Message } from 'grammy/types'
import { nanoid } from 'nanoid'
import _ from 'lodash'
import base64 from 'base64-js'
import path from 'path'
import fs from 'fs'

import { ExchangeMessageData } from '../types'
import { beautifyMarkdown } from '../utils/markdown.mjs'
import { sleep } from '../utils/sleep.mjs'

type CustomContext = FileFlavor<Context>

class BotApp {
  constructor(token: string) {
    const bot = new Bot<CustomContext>(token)

    bot.api.config.use(hydrateFiles(bot.token))

    bot.command('start', this.handleCommandStart)
    bot.command('voice', this.handleCommandVoice)
    bot.command('reset', this.handleCommandReset)

    bot.on('message::mention', this.handleMessageMention)
    bot.on('message:text', this.handleMessageText)
    bot.on('message:voice', this.handleMessageVoice)

    bot.callbackQuery('turn-on-voice', this.handleCallbackQueryTurnOnVoice)
    bot.callbackQuery('turn-off-voice', this.handleCallbackQueryTurnOffVoice)

    bot.catch = () => {}

    this.bot = bot
  }

  private bot: Bot<CustomContext>

  private typingTexts = ['_Typing._', '_Typing.._', '_Typing..._', '_Typing...._', '_Typing....._', '_Typing......_']

  private updateTypingTextInterval = 6000

  private contexts: Map<string /* chat id */, CustomContext> = new Map()

  private messages: Map<string /* message id */, Message.TextMessage> = new Map()

  private timers: Map<string /* message id */, any> = new Map()

  // default is false
  private voiceSettings: Map<string /* chat id */, boolean> = new Map()

  private handleCommandStart = async (ctx: CustomContext) => {
    console.log('handleCommandStart')
    if (process.env.START_COMMAND_REPLY_PHOTO !== undefined) {
      await ctx.replyWithPhoto(new InputFile(fs.readFileSync(process.env.START_COMMAND_REPLY_PHOTO))).catch(() => {})
      await sleep(100)
    }
    if (process.env.START_COMMAND_REPLY_TEXT !== undefined) {
      await ctx.reply(fs.readFileSync(process.env.START_COMMAND_REPLY_TEXT).toString('utf-8')).catch(() => {})
      await sleep(100)
    }
    if (process.env.START_COMMAND_REPLY_VOICE !== undefined) {
      await ctx.replyWithVoice(new InputFile(fs.readFileSync(process.env.START_COMMAND_REPLY_VOICE))).catch(() => {})
      await sleep(100)
    }

    if (
      process.env.START_COMMAND_REPLY_TEXT === undefined &&
      process.env.START_COMMAND_REPLY_PHOTO === undefined &&
      process.env.START_COMMAND_REPLY_VOICE === undefined
    ) {
      await ctx.reply('Hello!').catch(() => {})
    }
  }

  private handleCommandVoice = (ctx: CustomContext) => {
    console.log('handleCommandVoice')
    const chatId = ctx.chat?.id
    if (chatId === undefined) {
      return
    }
    const voiceSetting = this.voiceSettings.get(`${chatId}`)
    if (voiceSetting === true) {
      ctx
        .reply('The feature of voice is *enabled* now, you can:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: 'Turn off', callback_data: 'turn-off-voice' }]],
          },
        })
        .catch(() => {})
    } else {
      ctx
        .reply('The feature of voice is *disabled* now, you can:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: 'Turn on', callback_data: 'turn-on-voice' }]],
          },
        })
        .catch(() => {})
    }
  }

  private handleCommandReset = async (ctx: CustomContext) => {
    console.log('handleCommandReset')
    this.onMessageCallback?.({
      user: {
        id: `${ctx.from?.id}`,
      },
      chat: {
        id: `${ctx.chat?.id}`,
      },
      message: {
        id: nanoid(),
        type: 'command',
        content: 'reset',
      },
    })
    ctx.reply('Done!')
  }

  private handleCallbackQueryTurnOnVoice = (ctx: CustomContext) => {
    const chatId = ctx.chat?.id
    if (chatId === undefined) {
      return
    }
    this.voiceSettings.set(`${chatId}`, true)
    ctx
      .editMessageText(`The feature of voice is *enabled* now, you can:`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: 'Turn off', callback_data: 'turn-off-voice' }]],
        },
      })
      .catch(() => {})
  }

  private handleCallbackQueryTurnOffVoice = (ctx: CustomContext) => {
    const chatId = ctx.chat?.id
    if (chatId === undefined) {
      return
    }
    this.voiceSettings.set(`${chatId}`, false)
    ctx
      .editMessageText(`The feature of voice is *disabled* now, you can:`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: 'Turn on', callback_data: 'turn-on-voice' }]],
        },
      })
      .catch(() => {})
  }

  private handleMessageMention = async (ctx: CustomContext) => {
    console.log('handleMessageMention', ctx.chat?.type)
    const text = ctx.message?.text
    const type = ctx.chat?.type
    const chatId = ctx.chat?.id
    let isMentionMe =
      ctx.entities().find((entity) => {
        return entity.type === 'mention' && entity.text === `@${ctx.me.username}`
      }) !== undefined

    if (isMentionMe && text !== undefined && chatId !== undefined && (type === 'group' || type === 'supergroup')) {
      this.contexts.set(`${chatId}`, ctx)

      const msgId = nanoid()
      let typingTextIndex = 0

      const msg = await ctx.reply(this.typingTexts[typingTextIndex])
      this.messages.set(msgId, msg)

      const timer = setInterval(() => {
        typingTextIndex += 1
        const newContent = this.typingTexts[typingTextIndex % this.typingTexts.length]
        ctx.api
          .editMessageText(chatId, msg.message_id, newContent, {
            parse_mode: 'Markdown',
          })
          .catch(() => {})
      }, this.updateTypingTextInterval)
      this.timers.set(msgId, timer)

      const textArray = text.split('')
      ctx.entities().map((entity) => {
        textArray.splice(entity.offset, entity.length)
      })

      if (textArray.length > 0) {
        this.onMessageCallback?.({
          user: {
            id: `${ctx.from?.id}`,
          },
          chat: {
            id: `${chatId}`,
          },
          message: {
            id: msgId,
            type: 'text',
            content: textArray.join('').trim(),
          },
          options: {
            voice: this.voiceSettings.get(`${chatId}`) ?? false,
          },
        })
      }
    }
  }

  private handleMessageText = async (ctx: CustomContext) => {
    console.log('handleMessageText', ctx.chat?.type)
    const text = ctx.message?.text
    const type = ctx.chat?.type
    const chatId = ctx.chat?.id

    if (text !== undefined && chatId !== undefined && type === 'private') {
      this.contexts.set(`${chatId}`, ctx)

      const msgId = nanoid()
      let typingTextIndex = 0

      const msg = await ctx.reply(this.typingTexts[typingTextIndex], {
        parse_mode: 'Markdown',
      })
      this.messages.set(msgId, msg)

      const timer = setInterval(() => {
        typingTextIndex += 1
        ctx.api
          .editMessageText(chatId, msg.message_id, this.typingTexts[typingTextIndex % this.typingTexts.length], {
            parse_mode: 'Markdown',
          })
          .catch((e) => {})
      }, this.updateTypingTextInterval)
      this.timers.set(msgId, timer)

      this.onMessageCallback?.({
        user: {
          id: `${ctx.from?.id}`,
        },
        chat: {
          id: `${ctx.chat?.id}`,
        },
        message: {
          id: msgId,
          type: 'text',
          content: text,
        },
        options: {
          voice: this.voiceSettings.get(`${chatId}`) ?? false,
        },
      })
    }
  }

  private handleMessageVoice = async (ctx: CustomContext) => {
    console.log('handleMessageVoice', ctx.chat?.type, ctx.message?.voice)
  }

  private onMessageCallback = (data: ExchangeMessageData) => {}

  onMessage = (cb: (data: ExchangeMessageData) => void) => {
    this.onMessageCallback = cb
  }

  replyMessage = async (data: ExchangeMessageData) => {
    const ctx = this.contexts.get(data.chat.id)
    if (ctx !== undefined) {
      const prevMessage = this.messages.get(data.message.id)
      if (prevMessage !== undefined) {
        this.messages.delete(data.message.id)
        this.timers.delete(data.message.id)
        await ctx.api.deleteMessage(prevMessage.chat.id, prevMessage.message_id).catch(() => {})
      }

      const { type, content } = data.message
      const chatType = ctx.message.chat.type
      if (chatType === 'group' || chatType === 'supergroup'){
        const replyToMessageId = ctx.message.message_id
        if (type === 'text') {
          const markdownContent = beautifyMarkdown(content)
          await ctx
            .reply(markdownContent, {
              parse_mode: 'Markdown',
              reply_to_message_id: replyToMessageId
            })
            .catch(() => {})
        } else if (type === 'image') {
          await ctx.replyWithPhoto(new InputFile(Buffer.from(base64.toByteArray(content))), {reply_to_message_id: replyToMessageId}).catch(() => {})
        } else if (type === 'voice') {
          await ctx.replyWithVoice(new InputFile(Buffer.from(base64.toByteArray(content))), {reply_to_message_id: replyToMessageId}).catch(() => {})
        }
      }else{
        if (type === 'text') {
          const replyToMessageId = ctx.message.message_id
          const markdownContent = beautifyMarkdown(content)
          await ctx
            .reply(markdownContent, {
              parse_mode: 'Markdown',
            })
            .catch(() => {})
        } else if (type === 'image') {
          await ctx.replyWithPhoto(new InputFile(Buffer.from(base64.toByteArray(content)))).catch(() => {})
        } else if (type === 'voice') {
          await ctx.replyWithVoice(new InputFile(Buffer.from(base64.toByteArray(content)))).catch(() => {})
        }
      }
    }
  }

  start = () => {
    this.bot?.start()
  }

  stop = () => {
    this.bot?.stop()
  }
}

export default BotApp
