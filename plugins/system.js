const { command, mode } = require('../lib')
const runtime = require('./_menu')

command(
 {
  pattern: 'restart',
  fromMe: true,
  desc: 'Restart the bot',
  type: 'system',
 },
 async messsage => {
  await messsage.send(messsage.jid, 'restarting process...')
  exec('pm2 restart fxop', error => {
   if (error) {
    return messsage.send(`Error: ${error}`)
   }
  })
 }
)
command(
 {
  pattern: 'shutdown',
  fromMe: true,
  desc: 'Shut down bot',
  type: 'system',
 },
 async messsage => {
  await messsage.send('restarting process...')
  exec('pm2 stop fxop', error => {
   if (error) {
    return messsage.send(`Error: ${error}`)
   }
  })
 }
)
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

command(
 {
  pattern: 'runtime ?(.*)',
  fromMe: true,
  desc: 'Check uptime of bot',
  type: 'system',
 },
 async message => {
  message.send(`*Uptime:* ${runtime(process.uptime())}`)
 }
)
