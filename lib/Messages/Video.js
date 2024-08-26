const config = require('../../config')
const Base = require('./Base')
const fileType = require('file-type')
const { generateWAMessage } = require('baileys')
const { createInteractiveMessage } = require('../functions')
const { writeExifWebp } = require('../sticker')
const Message = require('./Message')
const { downloadMedia } = require('../serialize')
const axios = require('axios')
class Video extends Base {
 constructor(client, data) {
  super(client)
  if (data) this._patch(data)
 }

 _patch(data) {
  this.isGroup = data.isGroup
  this.id = data.key.id
  this.jid = data.key.remoteJid
  this.pushName = data.pushName
  this.participant = data.sender
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0])
  } catch {
   this.sudo = false
  }
  this.caption = data.body
  this.fromMe = data.key.fromMe
  this.timestamp = typeof data.messageTimestamp === 'object' ? data.messageTimestamp.low : data.messageTimestamp
  this.key = data.key
  this.message = data.message.videoMessage
  this.reply_message = data.quoted || false
  this.isBaileys = this.id.startsWith('BAE5')

  return super._patch(data)
 }
 async sendFile(content, options = {}, to) {
  const { data } = await this.client.getFile(content)
  const type = (await fileType.fromBuffer(data)) || {}
  const mimeType = type.mime ? type.mime.split('/')[0] : 'application'
  return this.client.sendMessage(to, { [mimeType]: data }, options)
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
 async sendFromUrl(url, options = {}, to) {
  try {
   const response = await axios({
    method: 'get',
    url: url,
    responseType: 'arraybuffer',
   })
   const buffer = response.data
   const type = (await fileType.fromBuffer(buffer)) || {}
   const mimeType = type.mime ? type.mime.split('/')[0] : 'application'
   return this.client.sendMessage(to, { [mimeType]: buffer }, options)
  } catch (error) {
   console.error('Error sending file from URL:', error)
   throw error
  }
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
    } else {
     throw new Error(`Unsupported content type for ${type}.`)
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
    if (mime === 'image/webp') {
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
 async download(pathFile = null) {
  try {
   const filePath = await downloadMedia(this.data.message, pathFile)
   return filePath
  } catch (error) {
   console.error('Failed to download media:', error)
   throw error
  }
 }
}

module.exports = Video
