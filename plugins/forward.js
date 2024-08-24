const { command, parsedJid, mode } = require('../lib/')

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
