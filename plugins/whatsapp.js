const { command, parsedJid, mode } = require('../lib/')
const { PausedChats } = require('../lib/database')
const config = require('../config')
const { downloadMediaMessage } = require('astrofx011')

command(
 {
  pattern: 'vv',
  fromMe: mode,
  desc: 'Forwards The View once messsage',
  type: 'whatsapp',
 },
 async (message, match, m) => {
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
