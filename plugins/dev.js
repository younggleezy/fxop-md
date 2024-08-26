const { command } = require('../lib/')
const util = require('util')

command(
 {
  on: 'text',
  fromMe: true,
  dontAddCommandList: true,
 },
 async message => {
  if (!message.text.startsWith('$') && !message.text.startsWith('>')) return

  const evalText = message.text.slice(1).trim()

  try {
   let result = eval(evalText)
   result = typeof result === 'object' ? util.inspect(result) : String(result)
   await message.reply(result)
  } catch (error) {
   await message.reply(`Error: ${error.message}`)
  }
 }
)
