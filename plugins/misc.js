const { bot, qrcode, Bitly, mode, isUrl, readQr } = require('../lib/')
const { server } = require('../lib/Misc')

bot(
 {
  pattern: 'fxop',
  info: 'Get how many active fxop active users',
  type: 'misc',
 },
 async message => {
  const socket = new server()
  await socket.fetchData()
  var result = `*_${socket.getActiveUsers()} are currently using fxop bot_*`
  await message.send(result)
 }
)

bot(
 {
  pattern: 'qr',
  fromMe: mode,
  desc: 'Read/Write Qr.',
  type: 'misc',
 },
 async (message, match, m) => {
  match = match || message.reply_message.text

  if (match) {
   let buff = await qrcode(match)
   return await message.sendMessage(message.jid, buff, {}, 'image')
  } else if (message.reply_message.image) {
   const buffer = await m.quoted.download()
   readQr(buffer)
    .then(async data => {
     return await message.sendMessage(message.jid, data)
    })
    .catch(async error => {
     console.error('Error:', error.message)
     return await message.sendMessage(message.jid, error.message)
    })
  } else {
   return await message.sendMessage(message.jid, '*Example : qr test*\n*Reply to a qr image.*')
  }
 }
)

bot(
 {
  pattern: 'bitly',
  fromMe: mode,
  desc: 'Converts Url to bitly',
  type: 'misc',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.sendReply('_Reply to a url or enter a url_')
  if (!isUrl(match)) return await message.sendReply('_Not a url_')
  let short = await Bitly(match)
  return await message.sendReply(short.link)
 }
)

