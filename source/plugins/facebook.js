const { bot } = require('../../lib')
const { Facebook } = require('../../lib/Misc')
bot(
 {
  pattern: 'facebook',
  info: 'Download Facebook Media',
  type: 'downloader',
 },
 async (message, match) => {
  if (!match) return await message.reply('_Provide Facebook link!_')
  await message.reply('processing')
  const facebook = new Facebook(match)
  const hdVideo = await facebook.getHdVideo()
  await message.sendMessage(message.jid, hdVideo, {}, 'video')
 }
)
