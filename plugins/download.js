const { bot, mode } = require('../lib')
const { Facebook, Instagram, Twitter, Tiktok } = require('../lib/Misc')
const { isTwiiterUrl, isFacebookUrl, isInstagramUrl, isLinkedInUrl, isYouTubeUrl, isTikTokUrl } = require('./Misc/vaildator')
bot(
 {
  pattern: 'facebook',
  fromMe: mode,
  info: 'Download Facebook Media',
  type: 'download',
 },
 async (message, match) => {
  if (!match) return await message.sendReply('_Provide Facebook link!_')
  if (!isFacebookUrl) return await message.sendReply('_invaild facebook url_')
  await message.sendReply('processing')
  const facebook = new Facebook(match)
  const hdVideo = await facebook.getHdVideo()
  return await message.send(hdVideo, {}, 'video')
 }
)

bot(
 {
  pattern: 'instagram',
  fromMe: mode,
  info: 'Download Instagram Media',
  type: 'download',
 },
 async (message, match) => {
  if (!match) return await message.sendReply('_Provide Instagram Link!_')
  if (!isInstagramUrl) return await message.sendReply('_invaild instagram url_')
  await message.sendReply('_Downloading_')
  const insta = new Instagram()
  const result = await insta.download(match)
  return await message.send(result, {}, 'video')
 }
)

bot(
 {
  pattern: 'twitter',
  fromMe: mode,
  info: 'Downloads twitter media',
  type: 'download',
 },
 async (message, match) => {
  if (!match) return await message.sendReply('_provide x url_')
  if (!isTwiiterUrl) return await message.sendReply('_invaild twiiter url_')
  await message.sendReply('_Downloading_')
  const twitter = new Twitter()
  const file = await twitter.download(match)
  return await message.send(file, {}, 'video')
 }
)

bot(
 {
  pattern: 'tiktok',
  fromMe: mode,
  info: 'Downloads Tiktok Media',
  type: 'download',
 },
 async (message, match) => {
  if (!match) return message.sendReply('_provide tiktok url_')
  if (!isTikTokUrl) return await message.sendReply('_invaild tiktok url_')
  await message.sendReply('_downloading_')
  const tiktok = new Tiktok()
  const file = tiktok.download(match)
  return await message.send(file, {}, 'video')
 }
)
