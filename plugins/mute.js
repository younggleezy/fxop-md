const { isAdmin, bot } = require('../lib')
const { getMuteSettings, setMuteSettings, removeMuteSettings, convertTo24Hour, setupCronJobs } = require('../lib/database/mute')

bot(
 {
  pattern: 'amute',
  fromMe: true,
  desc: 'Set auto mute time for the group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return message.reply('This command can only be used in groups')
  const isadmin = await isAdmin(message.jid, message.user, message.client)
  if (!isadmin) return await message.sendReply("_I'm not admin_")

  if (!match) return await message.sendReply('Please provide a valid time in 12-hour format (e.g., 10:00 PM)')

  const muteTime = match.trim()
  if (!/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i.test(muteTime)) {
   return message.reply('Please provide a valid time in 12-hour format (e.g., 10:00 PM)')
  }

  const mute24h = convertTo24Hour(muteTime)
  await setMuteSettings(message.jid, mute24h, null)
  return message.reply(`Auto mute time set to ${muteTime}`)
 }
)

bot(
 {
  pattern: 'aunmute',
  fromMe: true,
  desc: 'Set auto unmute time for the group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.isGroup) return message.reply('This command can only be used in groups')
  const isadmin = await isAdmin(message.jid, message.user, message.client)
  if (!isadmin) return await message.sendReply("_I'm not admin_")

  if (!match) return await message.sendReply('Please provide a valid time in 12-hour format (e.g., 07:00 AM)')

  const unmuteTime = match.trim()
  if (!/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i.test(unmuteTime)) {
   return message.reply('Please provide a valid time in 12-hour format (e.g., 07:00 AM)')
  }

  const unmute24h = convertTo24Hour(unmuteTime)
  await setMuteSettings(message.jid, null, unmute24h)
  return message.reply(`Auto unmute time set to ${unmuteTime}`)
 }
)
bot(
 {
  pattern: 'getmute',
  fromMe: true,
  desc: 'Get auto mute and unmute times for the group',
  type: 'group',
 },
 async message => {
  if (!message.isGroup) return message.reply('This command can only be used in groups')
  const isadmin = await isAdmin(message.jid, message.user, message.client)
  if (!isadmin) return await message.sendReply("_I'm not admin_")

  const settings = await getMuteSettings(message.jid)
  if (!settings || (!settings.muteTime && !settings.unmuteTime)) {
   return message.reply('No auto mute/unmute times set for this group')
  }

  let response = 'Auto mute/unmute times for this group:\n'
  if (settings.muteTime) response += `Mute time: ${settings.muteTime}\n`
  if (settings.unmuteTime) response += `Unmute time: ${settings.unmuteTime}`

  return message.reply(response)
 }
)

bot(
 {
  pattern: 'delmute',
  fromMe: true,
  desc: 'Delete auto mute and unmute settings for the group',
  type: 'group',
 },
 async message => {
  if (!message.isGroup) return message.reply('This command can only be used in groups')
  const isadmin = await isAdmin(message.jid, message.user, message.client)
  if (!isadmin) return await message.sendReply("_I'm not admin_")

  await removeMuteSettings(message.jid)
  return message.reply('Auto mute/unmute settings have been removed for this group')
 }
)
setupCronJobs(bot)
