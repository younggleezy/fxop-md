const { getFilter, setFilter, deleteFilter } = require('../lib/database/filters')
const { bot, parsedJid } = require('../lib')
var { HANDLERS } = require('../config')
const prefix = HANDLERS

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

bot(
 {
  pattern: 'clear ?(.*)',
  fromMe: true,
  desc: 'delete whatsapp chat',
  type: 'whatsapp',
 },
 async (message, match) => {
  await message.client.chatModify(
   {
    delete: true,
    lastMessages: [
     {
      key: message.data.key,
      messageTimestamp: message.messageTimestamp,
     },
    ],
   },
   message.jid
  )
  await message.reply('_Cleared.._')
 }
)

bot(
 {
  pattern: 'archive ?(.*)',
  fromMe: true,
  desc: 'archive whatsapp chat',
  type: 'whatsapp',
 },
 async (message, match) => {
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
  await message.reply('_Archived.._')
 }
)

bot(
 {
  pattern: 'unarchive ?(.*)',
  fromMe: true,
  desc: 'unarchive whatsapp chat',
  type: 'whatsapp',
 },
 async (message, match) => {
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
  await message.reply('_Unarchived.._')
 }
)

bot(
 {
  pattern: 'pin',
  fromMe: true,
  desc: 'pin a chat',
  type: 'whatsapp',
 },
 async (message, match) => {
  await message.client.chatModify(
   {
    pin: true,
   },
   message.jid
  )
  await message.reply('_Pined.._')
 }
)

bot(
 {
  pattern: 'unpin ?(.*)',
  fromMe: true,
  desc: 'unpin a msg',
  type: 'whatsapp',
 },
 async (message, match) => {
  await message.client.chatModify(
   {
    pin: false,
   },
   message.jid
  )
  await message.reply('_Unpined.._')
 }
)

bot(
 {
  pattern: 'block',
  fromMe: true,
  desc: 'Block a user',
  type: 'whatsapp',
 },
 async message => {
  let jid = message.quoted ? message.reply_message.sender : message.jid
  await message.client.updateBlockStatus(jid, 'block')
  await message.reply('_*Blocked!*_')
 }
)

bot(
 {
  pattern: 'unblock',
  fromMe: true,
  desc: 'Unblock a user',
  type: 'whatsapp',
 },
 async message => {
  let jid = message.quoted ? message.reply_message.sender : message.jid
  await message.client.updateBlockStatus(jid, 'unblock')
  await message.reply('_*Unblocked!*_')
 }
)

bot(
 {
  pattern: 'setbio',
  fromMe: true,
  desc: 'To change your profile status',
  type: 'whatsapp',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.send('*Need Status!*\n*Example: setbio Hey there! I am using WhatsApp*.')
  await message.client.updateProfileStatus(match)
  await message.reply('_Profile bio updated_')
 }
)

bot(
 {
  pattern: 'setname ?(.*)',
  fromMe: true,
  desc: 'To change your profile name',
  type: 'whatsapp',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.send('*Need Name!*\n*Example: setname your name*.')
  await message.client.updateProfileName(match)
  await message.reply('_Profile name updated_')
 }
)

// bot(
//  {
//   pattern: 'forward',
//   fromMe: true,
//   desc: 'Forwards the replied message',
//   type: 'whatsapp',
//  },
//  async (message, match) => {
//   if (!message.quoted) return await message.reply('Reply to message')
//   if (!match) return await message.reply("*Provide a JID; use 'jid' command to get JID*")
//   let jids = parsedJid(match)
//   for (let jid of jids) {
//    await message.client.forward(jid, message.reply_message.message)
//   }
//   await message.reply('_Message forwarded_')
//  }
// )

bot(
 {
  pattern: 'caption ?(.*)',
  fromMe: true,
  desc: 'Change video or image caption',
  type: 'whatsapp',
 },
 async (message, match) => {
  if (!message.reply_message.video && !message.reply_message.image && !message.image && !message.video) return await message.reply('*_Reply to an image or video_*')
  if (!match) return await message.reply('*Need a query, e.g., .caption Hello*')
  await message.client.forward(message.jid, message.quoted ? message.reply_message.message : message.message, { caption: match })
 }
)

bot(
 {
  pattern: 'getprivacy ?(.*)',
  fromMe: true,
  desc: 'get your privacy settings',
  type: 'privacy',
 },
 async (message, match) => {
  const { readreceipts, profile, status, online, last, groupadd, calladd } = await message.client.fetchPrivacySettings(true)
  const msg = `*♺ my privacy*\n\n*ᝄ name :* ${message.client.user.name}\n*ᝄ online:* ${online}\n*ᝄ profile :* ${profile}\n*ᝄ last seen :* ${last}\n*ᝄ read receipt :* ${readreceipts}\n*ᝄ about seted time :*\n*ᝄ group add settings :* ${groupadd}\n*ᝄ call add settings :* ${calladd}`
  let img = await message.client.profilePictureUrl(message.user.jid, 'image').catch(() => 'https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg')
  await message.send(img, { caption: msg }, 'image')
 }
)

bot(
 {
  pattern: 'lastseen ?(.*)',
  fromMe: true,
  desc: 'to change lastseen privacy',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change last seen privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateLastSeenPrivacy(match)
  await message.send(`_Privacy settings *last seen* Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'online ?(.*)',
  fromMe: true,
  desc: 'to change online privacy',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change *online*  privacy settings_`)
  const available_privacy = ['all', 'match_last_seen']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateOnlinePrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'mypp ?(.*)',
  fromMe: true,
  desc: 'privacy setting profile picture',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change *profile picture*  privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateProfilePicturePrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'mystatus ?(.*)',
  fromMe: true,
  desc: 'privacy for my status',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change *status*  privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateStatusPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'read ?(.*)',
  fromMe: true,
  desc: 'privacy for read message',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change *read and receipts message*  privacy settings_`)
  const available_privacy = ['all', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateReadReceiptsPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)

bot(
 {
  pattern: 'groupadd ?(.*)',
  fromMe: true,
  desc: 'privacy for group add',
  type: 'privacy',
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${prefix} all_\n_to change *group add*  privacy settings_`)
  const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none']
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`)
  await message.client.updateGroupsAddPrivacy(match)
  await message.send(`_Privacy Updated to *${match}*_`)
 }
)
