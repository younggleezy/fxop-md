const { command } = require('../lib')
const { parsedJid } = require('../lib/functions')
const { banUser, unbanUser, isBanned } = require('../lib/database/ban')
command(
 {
  on: 'message',
  fromMe: true,
  dontAddCommandList: true,
 },
 async message => {
  if (!message.isBaileys) return
  const isban = await isBanned(message.jid)
  if (!isban) return
  await message.reply('_Bot is banned in this chat_')
  const jid = parsedJid(message.participant)
  return await message.client.groupParticipantsUpdate(message.jid, jid, 'remove')
 }
)

command(
 {
  pattern: 'antibot',
  fromMe: true,
  desc: 'Ban or unban bot from a chat',
  type: 'group',
 },
 async (message, match) => {
  const chatid = message.jid
  const isban = await isBanned(chatid)
  if (!match) return await message.send('Please specify "on" or "off" after the command')

  if (match === 'on') {
   if (isban) {
    return await message.send('Antibot is already turned on')
   }
   await banUser(chatid)
   return await message.send('Antibot turned ON')
  }

  if (match === 'off') {
   if (!isban) {
    return await message.send('Antibot not turned off')
   }
   await unbanUser(chatid)
   return await message.send('AntiBot Turned Off')
  }
 }
)
