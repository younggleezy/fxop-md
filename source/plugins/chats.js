const { getFilter, setFilter, deleteFilter } = require('../database/filters')
const { bot } = require('../../lib')

bot(
 {
  pattern: 'clear',
  fromMe: true,
  desc: 'delete whatsapp chat',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify(
   {
    delete: true,
    lastMessages: [
     {
      key: message.key,
      messageTimestamp: message.messageTimestamp,
     },
    ],
   },
   message.jid
  )
  await message.send('_Cleared!_')
 }
)

bot(
 {
  pattern: 'archive',
  fromMe: true,
  desc: 'archive whatsapp chat',
  type: 'chats',
 },
 async message => {
  const lstMsg = {
   message: message.message,
   key: message.key,
   messageTimestamp: message.messageTimestamp,
  }
  await message.client.chatModify(
   {
    archive: true,
    lastMessages: [lstMsg],
   },
   message.jid
  )
  await message.send('_Archived_')
 }
)

bot(
 {
  pattern: 'unarchive',
  fromMe: true,
  desc: 'unarchive whatsapp chat',
  type: 'chats',
 },
 async message => {
  const lstMsg = {
   message: message.message,
   key: message.key,
   messageTimestamp: message.messageTimestamp,
  }
  await message.client.chatModify(
   {
    archive: false,
    lastMessages: [lstMsg],
   },
   message.jid
  )
  await message.send('_Unarchived_')
 }
)

bot(
 {
  pattern: 'pin',
  fromMe: true,
  desc: 'pin a chat',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify({ pin: true }, message.jid)
  await message.send('_Pined_')
 }
)

bot(
 {
  pattern: 'unpin',
  fromMe: true,
  desc: 'unpin a msg',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify({ pin: false }, message.jid)
  await message.send('_Unpined_')
 }
)

bot(
 {
  pattern: 'mread',
  fromMe: true,
  desc: 'mark as read',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify({ markRead: true, lastMessages: [message] }, message.jid)
 }
)

bot(
 {
  pattern: 'unread',
  fromMe: true,
  desc: 'mark as UnRead',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify({ markRead: false, lastMessages: [message] }, message.jid)
 }
)

bot(
 {
  pattern: 'cumute',
  fromMe: true,
  desc: 'unmute a chat',
  type: 'chats',
 },
 async message => {
  await message.client.chatModify({ mute: null }, message.jid)
  await message.send('_Chat Unmuted!_')
 }
)

bot(
 {
  pattern: 'pname',
  fromMe: true,
  desc: 'To change your profile name',
  type: 'whatsapp',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.send('*Need Name!*\n*Example: profilename your name*.')
  await message.client.updateProfileName(match)
  await message.reply('_Profile name updated!_')
 }
)

bot(
 {
  pattern: 'getprivacy',
  fromMe: true,
  desc: 'get your privacy settings',
  type: 'privacy',
 },
 async message => {
  const { readreceipts, profile, status, online, last, groupadd, calladd } = await message.client.fetchPrivacySettings(true)
  const msg = `*♺ whatsapp privacy settings*

*ᝄ name :* ${(message.fromMe && message.pushName ? message.pushName : message.client.user.name).split('\n').join('  ')}
*ᝄ number :* ${message.user.split('@')[0]}

*ᝄ online :* ${online}
*ᝄ profile :* ${profile}
*ᝄ last seen :* ${last}
*ᝄ whts status :* ${status}
*ᝄ read receipt :* ${readreceipts}

*ᝄ who can add in group :* ${groupadd}
*ᝄ who can call :* ${calladd}`
  let img = await message.getpp(message.user)
  await message.sendMessage(message.jid, img, { caption: msg }, 'image')
 }
)

bot(
 {
  pattern: 'lastseen',
  fromMe: true,
  desc: 'to change lastseen privacy',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .lastseen all_\n_to change last seen privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join(' / ')}* values_`)
  await message.client.updateLastSeenPrivacy(match)
  await message.send(`_Privacy settings *last seen* Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'online',
  fromMe: true,
  desc: 'to change online privacy',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .online all_\n_to change *online*  privacy settings_`)
  const available_privacy = ['all', 'match_last_seen']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateOnlinePrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'mypp',
  fromMe: true,
  desc: 'privacy setting profile picture',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .mypp all_\n_to change *profile picture*  privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateProfilePicturePrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'mystatus',
  fromMe: true,
  desc: 'privacy for my status',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .mystatus all_\n_to change *status*  privacy settings_`)
  const privacys = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!privacys.includes(match)) return await message.send(`_action must be *${privacys.join('/')}* values_`)
  await message.client.updateStatusPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'read',
  fromMe: true,
  desc: 'privacy for read message',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .read all_\n_to change *read and receipts message*  privacy settings_`)
  const privacys = ['all', 'none']
  if (!privacys.includes(match)) return await message.send(`_action must be *${privacys.join('/')}* values_`)
  await message.client.updateReadReceiptsPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'gcadd',
  fromMe: true,
  desc: 'privacy for group add',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* .groupadd all_\n_to change *group add*  privacy settings_`)
  const privacys = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!privacys.includes(match)) return await message.send(`_action must be *${privacys.join('/')}* values_`)
  await message.client.updateGroupsAddPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'filter',
  fromMe: true,
  desc: 'Adds a filter. When someone triggers the filter, it sends the corresponding response. To view your filter list, use `.filter`.',
  usage: '.filter keyword:message',
  type: 'filter',
 },
 async (message, match) => {
  let text, msg
  try {
   ;[text, msg] = match.split(':')
  } catch {}
  if (!match) {
   filtreler = await getFilter(message.jid)
   if (filtreler === false) {
    await message.reply('No filters are currently set in this chat.')
   } else {
    var mesaj = 'Your active filters for this chat:' + '\n\n'
    filtreler.map(filter => (mesaj += `✒ ${filter.dataValues.pattern}\n`))
    mesaj += 'use : .filter keyword:message\nto set a filter'
    await message.reply(mesaj)
   }
  } else if (!text || !msg) {
   return await message.reply('```use : .filter keyword:message\nto set a filter```')
  } else {
   await setFilter(message.jid, text, msg, true)
   return await message.reply(`_Sucessfully set filter for ${text}_`)
  }
 }
)

bot(
 {
  pattern: 'fstop',
  fromMe: true,
  desc: 'Stops a previously added filter.',
  usage: '.stop "hello"',
  type: 'filter',
 },
 async (message, match) => {
  if (!match) return await message.reply('\n*Example:* ```.stop hello```')

  del = await deleteFilter(message.jid, match)
  await message.reply(`_Filter ${match} deleted_`)

  if (!del) {
   await message.reply('No existing filter matches the provided input.')
  }
 }
)

bot({ on: 'text', fromMe: false, dontAddCommandList: true }, async (message, match) => {
 var filtreler = await getFilter(message.jid)
 if (!filtreler) return
 filtreler.map(async filter => {
  pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : '\\b(' + filter.dataValues.pattern + ')\\b', 'gm')
  if (pattern.test(match)) {
   return await message.reply(filter.dataValues.text, {
    quoted: message,
   })
  }
 })
})
