const { decodeJid } = require('..')
const config = require('../../config')
const { parsedJid } = require('../functions')
const Base = require('./Base')
const fileType = require('file-type')
const { tmpdir } = require('os')
const fs = require('fs')
const Message = require('./Message')
const { jidNormalizedUser, getContentType } = require('baileys')
class ReplyMessage extends Base {
 constructor(client, data) {
  super(client)
  if (data) this._patch(data)
 }
 _patch(data) {
  this.key = data.key
  this.id = data.stanzaId
  this.sender = jidNormalizedUser(data.participant)
  this.fromMe = this.sender === jidNormalizedUser(this.client.user.id)
  this.isBaileys = this.id.startsWith('BAE5') || this.id.length === 16
  this.jid = data.participant
  this.isPm = this.chat.endsWith('@s.whatsapp.net')
  this.isBot = this.id.startsWith('BAE5') && this.id.length === 16
  this.chat = this.jid = data.remoteJid || data.chat
  this.type = getContentType(data.quotedMessage)
  this.msg = data.quotedMessage
  this.text = this.msg[this.mtype]?.text || this.msg[this.mtype]?.caption || this.msg.conversation || this.msg[this.mtype]?.contentText || this.msg[this.mtype]?.selectedDisplayText || this.msg[this.mtype]?.title || false
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0])
  } catch {
   this.sudo = false
  }
  this.fromMe = parsedJid(this.client.user.jid)[0] === parsedJid(this.jid)[0]
  const { quotedMessage } = data
  if (quotedMessage) {
   let type = Object.keys(quotedMessage)[0]
   if (type === 'extendedTextMessage') {
    this.text = quotedMessage[type].text
    this.mimetype = 'text/plain'
   } else if (type === 'conversation') {
    this.text = quotedMessage[type]
    this.mimetype = 'text/plain'
   } else if (type === 'stickerMessage') {
    this.mimetype = 'image/webp'
    this.sticker = quotedMessage[type]
   } else {
    let mimetype = quotedMessage[type]?.mimetype ? quotedMessage[type].mimetype : type
    if (mimetype?.includes('/')) {
     this.mimetype = mimetype
     let mime = mimetype.split('/')[0]
     this[mime] = quotedMessage[type]
    } else {
     this.mimetype = mimetype
     this.message = quotedMessage[type]
    }
   }
  }
  return super._patch(data)
 }

 async downloadMediaMessage() {
  const buff = await this.m.quoted.download()
  const type = await fileType.fromBuffer(buff)
  await fs.promises.writeFile(tmpdir() + type.ext, buff)
  return tmpdir() + type.ext
 }

 async reply(text, options) {
  const message = await this.client.sendMessage(this.jid, { text }, { quoted: this.data, ...options })
  return new Message(this.client, message)
 }

 async delete() {
  return await this.client.sendMessage(this.jid, { delete: this.key })
 }

 async edit(text, opt) {
  await this.client.sendMessage(this.jid, { text, edit: this.key, ...opt })
 }
}

module.exports = ReplyMessage
