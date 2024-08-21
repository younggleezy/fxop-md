const config = require('../../config')
const Base = require('./Base')
const fs = require('fs')
const fileType = require('file-type')
const { generateWAMessage } = require('baileys')
const { createInteractiveMessage } = require('../functions')
const Message = require('./Message')
const { writeExifWebp } = require('../sticker')
class Sticker extends Base {
 constructor(client, data) {
  super(client)
  if (data) this._patch(data)
 }

 _patch(data) {
  this.key = data.key
  this.id = data.key.id
  this.jid = data.key.remoteJid
  this.isGroup = data.isGroup
  this.participant = data.sender
  this.isBaileys = this.id.startsWith('BAE5')
  this.message = data.message.stickerMessage
  this.pushName = data.pushName
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0])
  } catch {
   this.sudo = false
  }
  this.timestamp = typeof data.messageTimestamp === 'object' ? data.messageTimestamp.low : data.messageTimestamp
  this.sticker = true

  return super._patch(data)
 }

 async downloadMediaMessage() {
  let buff = await this.m.download()
  let name = new Date().getTime().toString()
  await fs.promises.writeFile(name, buff)
  return name
 }
 async sendFile(content, options = {}) {
  let { data } = await this.client.getFile(content)
  let type = await fileType.fromBuffer(data)
  return this.client.sendMessage(this.jid, { [type.mime.split('/')[0]]: data, ...options }, { ...options })
 }
 async reply(text, opt = {}) {
  return this.client.sendMessage(
   this.jid,
   {
    text: require('util').format(text),
    ...opt,
   },
   { ...opt, quoted: this }
  )
 }
 async send(content, options = {}, type = 'text', jid = null) {
  let recipient = jid || this.jid
  if (!recipient) {
   throw new Error('No recipient specified. Please provide a JID or ensure this.jid is set.')
  }

  if (typeof recipient === 'string' && !recipient.endsWith('@s.whatsapp.net')) {
   recipient += '@s.whatsapp.net'
  }

  const defaultOptions = { packname: 'Xasena', author: 'X-electra' }
  const opt = { ...defaultOptions, ...options }

  const isUrl = url => {
   try {
    new URL(url)
    return true
   } catch {
    return false
   }
  }

  switch (type.toLowerCase()) {
   case 'text':
    return this.client.sendMessage(recipient, { text: content, ...opt })

   case 'file':
    const { data } = await this.client.getFile(content)
    const fileTypeInfo = (await fileType.fromBuffer(data)) || {}
    return this.client.sendMessage(recipient, { [fileTypeInfo.mime.split('/')[0]]: data }, opt)

   case 'edit':
    return this.client.sendMessage(recipient, { text: content, edit: this.key, ...opt })

   case 'reply':
    const replyMessage = await this.client.sendMessage(recipient, { text: content }, { quoted: this.data, ...opt })
    return new Message(this.client, replyMessage)

   case 'image':
   case 'photo':
   case 'video':
   case 'audio':
    if (Buffer.isBuffer(content)) {
     return this.client.sendMessage(recipient, { [type]: content, ...opt })
    } else if (isUrl(content)) {
     return this.client.sendMessage(recipient, { [type]: { url: content }, ...opt })
    }
    break

   case 'template':
    const optional = await generateWAMessage(recipient, content, opt)
    const templateMessage = {
     viewOnceMessage: {
      message: {
       ...optional.message,
      },
     },
    }
    return this.client.relayMessage(recipient, templateMessage, { messageId: optional.key.id })

   case 'interactive':
    const genMessage = createInteractiveMessage(content)
    return this.client.relayMessage(recipient, genMessage.message, { messageId: genMessage.key.id })

   case 'sticker':
    const { data: stickerData, mime } = await this.client.getFile(content)
    if (mime == 'image/webp') {
     const buff = await writeExifWebp(stickerData, opt)
     return this.client.sendMessage(recipient, { sticker: { url: buff }, ...opt }, opt)
    } else {
     const mimePrefix = mime.split('/')[0]
     if (mimePrefix === 'video' || mimePrefix === 'image') {
      return this.client.sendImageAsSticker(recipient, content, opt)
     }
    }
    break

   default:
    throw new Error(`Unsupported message type: ${type}`)
  }
 }
}

module.exports = Sticker
