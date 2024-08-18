const { bot } = require('../../lib')
const { parsedJid } = require('../../lib/functions')
const { banUser, unbanUser, isBanned } = require('../database/ban')
bot(
 {
  on: 'message',
  fromMe: true,
  dontAddCommandList: true,
 },
 async message => {
  if (!message.isBaileys) return
  const isban = await isBanned(message.jid)
  if (!isban) return
  await message.reply('_Antibot Detected A Baileys Bot!_')
  await message.reply('kicking!')
  const jid = parsedJid(message.participant)
  return await message.client.groupParticipantsUpdate(message.jid, jid, 'remove')
 }
)

bot(
 {
  pattern: 'antibot ?(.*)',
  fromMe: true,
  desc: 'Turn bot ban on or off in a chat',
  type: 'group',
 },
 async (message, match) => {
  const chatid = message.jid
  if (!match) return await message.reply('Provide vaild action, on | off')
  const action = match.trim().toLowerCase()
  if (action === 'on') {
   const isban = await isBanned(chatid)
   if (isban) {
    return await message.sendMessage(message.jid, 'Antibot Enabled!')
   }
   await banUser(chatid)
   return await message.sendMessage(message.jid, 'Antibot Already Enabled!')
  } else if (action === 'off') {
   const isban = await isBanned(chatid)
   if (!isban) {
    return await message.sendMessage(message.jid, 'Antibot is not enabled!')
   }
   await unbanUser(chatid)
   return await message.sendMessage(message.jid, 'Antibot set Disabled')
  }
 }
)
