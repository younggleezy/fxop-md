const { command, parsedJid, mode, serialize } = require('../lib/')
const { PausedChats } = require('../lib/database')
const config = require('../config')
const { DELETED_LOG_CHAT, DELETED_LOG } = require('../config')
const { loadMessage, getName } = require('../lib/database/StoreDb')
const { downloadMediaMessage } = require('baileys')

command(
 {
  pattern: 'vv',
  fromMe: mode,
  desc: 'Forwards The View once messsage',
  type: 'whatsapp',
 },
 async (message, m) => {
  let buff = await m.quoted.download()
  return await message.sendFile(buff)
 }
)

command(
 {
  on: 'text',
  fromMe: !config.STATUS_SAVER,
  desc: 'Save or Give Status Updates',
  dontAddCommandList: true,
 },
 async (message, match, m) => {
  try {
   if (message.isGroup) return
   const triggerKeywords = ['save', 'send', 'sent', 'snt', 'give', 'snd']
   const cmdz = match.toLowerCase().split(' ')[0]
   if (triggerKeywords.some(tr => cmdz.includes(tr))) {
    const relayOptions = { messageId: m.quoted.key.id }
    return await message.client.relayMessage(message.jid, m.quoted.message, relayOptions)
   }
  } catch (error) {
   console.error('[Error]:', error)
  }
 }
)
command(
 {
  pattern: 'forward',
  fromMe: mode,
  desc: 'Forwards the replied Message',
  type: 'whatsapp',
 },
 async (message, match, client) => {
  if (!client.quoted) return message.reply('Reply to something')
  let jids = parsedJid(match)
  for (let i of jids) {
   await message.forward(i, message.reply_message.message)
  }
 }
)
command(
 {
  pattern: 'pause',
  fromMe: true,
  desc: 'Pause the chat',
  type: 'whatsapp',
 },
 async message => {
  const chatId = message.key.remoteJid
  try {
   await PausedChats.savePausedChat(chatId)
   message.reply('Chat paused successfully.')
  } catch (error) {
   console.error(error)
   message.reply('Error pausing the chat.')
  }
 }
)

command(
 {
  pattern: 'resume',
  fromMe: true,
  desc: 'Resume the paused chat',
  type: 'whatsapp',
 },
 async message => {
  const chatId = message.key.remoteJid

  try {
   const pausedChat = await PausedChats.PausedChats.findOne({
    where: { chatId },
   })

   if (pausedChat) {
    await pausedChat.destroy()
    message.reply('Chat resumed successfully.')
   } else {
    message.reply('Chat is not paused.')
   }
  } catch (error) {
   console.error(error)
   message.reply('Error resuming the chat.')
  }
 }
)

command(
 {
  pattern: 'setpp',
  fromMe: true,
  desc: 'Set profile picture',
  type: 'whatsapp',
 },
 async (message, match, m) => {
  if (!message.reply_message.image) return await message.reply('_Reply to a photo_')
  let buff = await m.quoted.download()
  await message.setPP(message.user, buff)
  return await message.reply('_Profile Picture Updated_')
 }
)

command(
 {
  pattern: 'setname',
  fromMe: true,
  desc: 'Set User name',
  type: 'whatsapp',
 },
 async (message, match) => {
  if (!match) return await message.reply('_Enter name_')
  await message.updateName(match)
  return await message.reply(`_Username Updated : ${match}_`)
 }
)

command(
 {
  pattern: 'block',
  fromMe: true,
  desc: 'Block a person',
  type: 'whatsapp',
 },
 async (message, match) => {
  if (message.isGroup) {
   let jid = message.mention[0] || message.reply_message.jid
   if (!jid) return await message.reply('_Reply to a person or mention_')
   await message.block(jid)
   return await message.sendMessage(`_@${jid.split('@')[0]} Blocked_`, {
    mentions: [jid],
   })
  } else {
   await message.block(message.jid)
   return await message.reply('_User blocked_')
  }
 }
)

command(
 {
  pattern: 'unblock',
  fromMe: true,
  desc: 'Unblock a person',
  type: 'whatsapp',
 },
 async (message, match) => {
  if (message.isGroup) {
   let jid = message.mention[0] || message.reply_message.jid
   if (!jid) return await message.reply('_Reply to a person or mention_')
   await message.block(jid)
   return await message.sendMessage(message.jid, `_@${jid.split('@')[0]} unblocked_`, {
    mentions: [jid],
   })
  } else {
   await message.unblock(message.jid)
   return await message.reply('_User unblocked_')
  }
 }
)

command(
 {
  pattern: 'jid',
  fromMe: true,
  desc: 'Give jid of chat/user',
  type: 'whatsapp',
 },
 async message => {
  return await message.sendMessage(message.jid, message.mention[0] || message.reply_message.jid || message.jid)
 }
)

command(
 {
  pattern: 'dlt',
  fromMe: true,
  desc: 'deletes a message',
  type: 'whatsapp',
 },
 async (message, client) => {
  if (message.isGroup) {
   client.sendMessage(message.jid, { delete: message.reply_message.key })
  }
 }
)

command(
 {
  on: 'delete',
  fromMe: false,
  desc: 'Logs the recent deleted message',
 },
 async (message, match) => {
  if (!DELETED_LOG) return
  if (!DELETED_LOG_CHAT) return await message.sendMessage(message.user, 'Please set DELETED_LOG_CHAT in ENV to use log delete message')
  let msg = await loadMessage(message.messageId)
  if (!msg) return
  msg = await serialize(JSON.parse(JSON.stringify(msg.message)), message.client)
  if (!msg) return await message.reply('No deleted message found')
  let deleted = await message.forward(DELETED_LOG_CHAT, msg.message)
  var name
  if (!msg.from.endsWith('@g.us')) {
   let getname = await getName(msg.from)
   name = `_Name : ${getname}_`
  } else {
   let gname = (await message.client.groupMetadata(msg.from)).subject
   let getname = await getName(msg.sender)
   name = `_Group : ${gname}_\n_Name : ${getname}_`
  }
  return await message.sendMessage(DELETED_LOG_CHAT, `_Message Deleted_\n_From : ${msg.from}_\n${name}\n_SenderJid : ${msg.sender}_`, { quoted: deleted })
 }
)

command(
 {
  pattern: 'quoted',
  fromMe: mode,
  desc: 'quoted message',
 },
 async (message, match) => {
  if (!message.reply_message) return await message.reply('*Reply to a message*')
  let key = message.reply_message.key
  let msg = await loadMessage(key.id)
  if (!msg) return await message.reply('_Message not found maybe bot might not be running at that time_')
  msg = await serialize(JSON.parse(JSON.stringify(msg.message)), message.client)
  if (!msg.quoted) return await message.reply('No quoted message found')
  await message.forward(message.jid, msg.quoted.message)
 }
)
