const { bot } = require('../../lib')
const { labs } = require('../../lib/Misc')

bot(
 {
  pattern: 'elabs',
  info: 'Text To Speech Eleven Labs',
  type: 'ai',
 },
 async (message, match) => {
  if (!match) return await message.reply('_Provide me text to Generate Speech_')
  await message.reply('_processing!_')
  const speechAudio = await labs(match)
  await message.sendMessage(message.jid, speechAudio, {}, 'audio')
 }
)
