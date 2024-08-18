const { bot, parsedJid, mode } = require('../../lib/')

bot(
 {
  pattern: 'forward',
  fromMe: mode,
  desc: 'Forwards the replied Message',
  type: 'whatsapp',
 },
 async (message, match, m) => {
  if (!m.quoted) return message.reply('Reply to something')
  let jids = parsedJid(match)
  for (let i of jids) {
   await message.forward(i, message.reply_message.message)
  }
 }
)
