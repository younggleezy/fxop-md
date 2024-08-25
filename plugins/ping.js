const {command, mode} = require('../lib')
command(
 {
  pattern: 'ping ?(.*)',
  fromMe: mode,
  desc: 'Bot response in milliseconds.',
  type: 'system',
 },
 async message => {
  const start = new Date().getTime()
  const msg = await message.reply('*ᴩɪɴɢ...*')
  const end = new Date().getTime()
  const responseTime = (end - start) / 1000
  await msg.edit(`*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ ${responseTime} secs*`)
 }
)
