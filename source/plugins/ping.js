const { bot, mode } = require('../../lib/')
bot(
 {
  pattern: 'ping ?(.*)',
  fromMe: mode,
  desc: 'Bot response in milliseconds.',
  type: 'info',
 },
 async (message, match, client) => {
  const start = new Date().getTime()
  const msg = await message.reply('*ᴩɪɴɢ...*')
  const end = new Date().getTime()
  const responseTime = end - start
  await message.reply(`*pong!*\nʟᴀᴛᴇɴᴄʏ: ${responseTime} ms`)
 }
)
