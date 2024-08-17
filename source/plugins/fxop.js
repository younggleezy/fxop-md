const { bot } = require('../../lib')
const { Socket } = require('../../lib/Misc')
bot(
 {
  pattern: 'fxop',
  info: 'Get how many active fxop active users',
  type: 'misc',
 },
 async message => {
  const socket = new Socket()
  await socket.fetchData()
  var result = `There are *${socket.getActiveUsers()}* users on fxop`
  await message.sendMessage(message.jid, result)
 }
)
