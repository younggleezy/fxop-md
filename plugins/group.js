const { bot, isAdmin, parsedJid } = require('../lib/')
const { setMessage, getMessage, delMessage, getStatus, toggleStatus } = require('../lib/database').Greetings
const { banUser, unbanUser, isBanned } = require('../lib/database/ban')
const { WarnDB } = require('../lib/database')
const { WARN_COUNT } = require('../config')
const { saveWarn, resetWarn, delWarn } = WarnDB

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

bot(
 {
  pattern: 'welcome',
  fromMe: true,
  desc: 'description',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return
  let { prefix } = message
  let status = await getStatus(message.jid, 'welcome')
  let stat = status ? 'on' : 'off'

  if (!match) {
   let replyMsg = `Welcome manager\n\nGroup: ${
    (await message.client.groupMetadata(message.jid)).subject
   }\nStatus: ${stat}\n\nAvailable Actions:\n\n- ${prefix}welcome info: Get the welcome message\n- ${prefix}welcome on: Enable welcome message\n- ${prefix}welcome off: Disable welcome message\n- ${prefix}welcome delete: Delete the welcome message`

   return await message.reply(replyMsg)
  }

  if (match === 'info') {
   let msg = await getMessage(message.jid, 'welcome')
   if (!msg) return await message.reply('_There is no welcome set_')
   return message.reply(msg.message)
  }

  if (match === 'on') {
   let msg = await getMessage(message.jid, 'welcome')
   if (!msg) return await message.reply('_There is no welcome message to enable_')
   if (status) return await message.reply('_Welcome already enabled_')
   await toggleStatus(message.jid)
   return await message.reply('_Welcome enabled_')
  }

  if (match === 'off') {
   if (!status) return await message.reply('_Welcome already disabled_')
   await toggleStatus(message.jid, 'welcome')
   return await message.reply('_Welcome disabled_')
  }

  if (match == 'delete') {
   await delMessage(message.jid, 'welcome')
   return await message.reply('_Welcome message deleted_')
  }
  await setMessage(message.jid, 'welcome', match)
  return await message.reply('_Welcome message set_')
 }
)

bot(
 {
  pattern: 'goodbye',
  fromMe: true,
  desc: 'description',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return
  let status = await getStatus(message.jid, 'goodbye')
  let stat = status ? 'on' : 'off'
  let replyMsg = `Goodbye manager\n\nGroup: ${
   (await message.client.groupMetadata(message.jid)).subject
  }\nStatus: ${stat}\n\nAvailable Actions:\n\n- goodbye info: Get the goodbye message\n- goodbye on: Enable goodbye message\n- goodbye off: Disable goodbye message\n- goodbye delete: Delete the goodbye message`

  if (!match) {
   return await message.reply(replyMsg)
  }

  if (match === 'info') {
   let msg = await getMessage(message.jid, 'goodbye')
   if (!msg) return await message.reply('_There is no goodbye set_')
   return message.reply(msg.message)
  }

  if (match === 'on') {
   await toggleStatus(message.jid, 'goodbye')
   return await message.reply('_Goodbye enabled_')
  }

  if (match === 'off') {
   await toggleStatus(message.jid)
   return await message.reply('_Goodbye disabled_')
  }

  if (match === 'delete') {
   await delMessage(message.jid, 'goodbye')
   return await message.reply('_Goodbye deleted_')
  }

  await setMessage(message.jid, 'goodbye', match)
  return await message.reply('_Goodbye message set_')
 }
)

bot(
 {
  pattern: 'warn',
  fromMe: true,
  desc: 'Warn a user',
 },
 async (message, match) => {
  const userId = message.mention[0] || message.reply_message.jid
  if (!userId) return message.reply('_Mention or reply to someone_')
  let reason = message?.reply_message.text || match
  reason = reason.replace(/@(\d+)/, '')
  reason = reason ? reason.length <= 1 : 'Reason not Provided'

  const warnInfo = await saveWarn(userId, reason)
  let userWarnCount = warnInfo ? warnInfo.warnCount : 0
  userWarnCount++
  await message.reply(`_User @${userId.split('@')[0]} warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`, { mentions: [userId] })
  if (userWarnCount > WARN_COUNT) {
   const jid = parsedJid(userId)
   await message.sendMessage(message.jid, 'Warn limit exceeded kicking user')
   return await message.client.groupParticipantsUpdate(message.jid, jid, 'remove')
  }
  return
 }
)

bot(
 {
  pattern: 'rwarn',
  fromMe: true,
  desc: 'Reset warnings for a user',
 },
 async message => {
  const userId = message.mention[0] || message.reply_message.jid
  if (!userId) return message.reply('_Mention or reply to someone_')
  await resetWarn(userId)
  return await message.reply(`_Warnings for @${userId.split('@')[0]} reset_`, {
   mentions: [userId],
  })
 }
)

bot(
 {
  pattern: 'delwarn',
  fromMe: true,
  desc: 'Delete a specific warning for a user',
  type: 'group',
 },
 async (message, match) => {
  const userId = message.mention[0] || message.reply_message.jid
  if (!userId) return message.reply('_Mention or reply to someone_')

  const reason = match || (message?.reply_message.text ? message.reply_message.text.trim() : null)
  if (!reason) return message.reply('_Provide the reason to delete_')

  const warnInfo = await delWarn(userId, reason)
  if (warnInfo) {
   await message.reply(`_Warning reason deleted for @${userId.split('@')[0]}._ \n_Warn Count: ${warnInfo.warnCount}._`, { mentions: [userId] })
  } else {
   await message.reply(`_No such warning reason found for @${userId.split('@')[0]}._`, { mentions: [userId] })
  }
  return
 }
)

bot(
 {
  pattern: 'add',
  fromMe: true,
  desc: 'add a person to group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')

  match = match || message.reply_message.jid
  if (!match) return await message.reply('_Mention user to add')

  const isadmin = await isAdmin(message.jid, message.user, message.client)

  if (!isadmin) return await message.reply("_I'm not admin_")
  const jid = parsedJid(match)

  await message.client.groupParticipantsUpdate(message.jid, jid, 'add')

  return await message.reply(`_@${jid[0].split('@')[0]} added_`, {
   mentions: [jid],
  })
 }
)

bot(
 {
  pattern: 'kick',
  fromMe: true,
  desc: 'kicks a person from group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')

  match = match || message.reply_message.jid
  if (!match) return await message.reply('_Mention user to kick_')

  const isadmin = await isAdmin(message.jid, message.user, message.client)

  if (!isadmin) return await message.reply("_I'm not admin_")
  const jid = parsedJid(match)

  await message.client.groupParticipantsUpdate(message.jid, jid, 'remove')

  return await message.reply(`_@${jid[0].split('@')[0]} kicked_`, {
   mentions: [jid],
  })
 }
)
bot(
 {
  pattern: 'promote',
  fromMe: true,
  desc: 'promote to admin',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')

  match = match || message.reply_message.jid
  if (!match) return await message.reply('_Mention user to promote_')

  const isadmin = await isAdmin(message.jid, message.user, message.client)

  if (!isadmin) return await message.reply("_I'm not admin_")
  const jid = parsedJid(match)

  await message.client.groupParticipantsUpdate(message.jid, jid, 'promote')

  return await message.reply(`_@${jid[0].split('@')[0]} promoted as admin_`, {
   mentions: [jid],
  })
 }
)
bot(
 {
  pattern: 'demote',
  fromMe: true,
  desc: 'demote from admin',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')

  match = match || message.reply_message.jid
  if (!match) return await message.reply('_Mention user to demote_')

  const isadmin = await isAdmin(message.jid, message.user, message.client)

  if (!isadmin) return await message.reply("_I'm not admin_")
  const jid = parsedJid(match)

  await message.client.groupParticipantsUpdate(message.jid, jid, 'demote')

  return await message.reply(`_@${jid[0].split('@')[0]} demoted from admin_`, {
   mentions: [jid],
  })
 }
)

bot(
 {
  pattern: 'mute',
  fromMe: true,
  desc: 'nute group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')
  if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_")
  await message.reply('_Muting_')
  return await client.groupSettingUpdate(message.jid, 'announcement')
 }
)

bot(
 {
  pattern: 'unmute',
  fromMe: true,
  desc: 'unmute group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')
  if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_")
  await message.reply('_Unmuting_')
  return await client.groupSettingUpdate(message.jid, 'not_announcement')
 }
)

bot(
 {
  pattern: 'gjid',
  fromMe: true,
  desc: 'gets jid of all group members',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.isGroup) return await message.reply('_This command is for groups_')
  let { participants } = await client.groupMetadata(message.jid)
  let participant = participants.map(u => u.id)
  let str = '╭──〔 *Group Jids* 〕\n'
  participant.forEach(result => {
   str += `├ *${result}*\n`
  })
  str += `╰──────────────`
  message.reply(str)
 }
)

bot(
 {
  pattern: 'tagall',
  fromMe: true,
  desc: 'mention all users in group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return
  const { participants } = await message.client.groupMetadata(message.jid)
  let teks = ''
  for (let mem of participants) {
   teks += ` @${mem.id.split('@')[0]}\n`
  }
  message.sendMessage(message.jid, teks.trim(), {
   mentions: participants.map(a => a.id),
  })
 }
)

bot(
 {
  pattern: 'tag',
  fromMe: true,
  desc: 'mention all users in group',
  type: 'group',
 },
 async (message, match) => {
  console.log('match')
  match = match || message.reply_message.text
  if (!match) return message.reply('_Enter or reply to a text to tag_')
  if (!message.isGroup) return
  const { participants } = await message.client.groupMetadata(message.jid)
  message.sendMessage(message.jid, match, {
   mentions: participants.map(a => a.id),
  })
 }
)
