const { bot, qrcode, Bitly, mode, isUrl, readQr } = require('../lib/')
const { getLyrics } = require('../lib/functions')
const { fromBuffer } = require('file-type')
const { ffmpeg, parseTimeToSeconds } = require('../lib/functions')
const { removeBg } = require('../lib/functions')
const config = require('../config')
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

bot(
 {
  pattern: 'lyric',
  fromMe: mode,
  desc: 'Searches for lyrics based on the format: song;artist',
  type: 'misc',
 },
 async (message, match) => {
  const [song, artist] = match.split(';').map(item => item.trim())
  if (!song || !artist) {
   await message.sendReply('Search with this format: \n\t_lyric song;artist_')
  } else {
   try {
    const data = await getLyrics(song, artist)
    if (data) {
     return await message.sendReply(`*Artist:* ${data.artist_name}\n*Song:* ${data.song}\n*Lyrics:*\n${data.lyrics.trim()}`)
    } else {
     return await message.sendReply('No lyrics found for this song by this artist.')
    }
   } catch (error) {
    return await message.sendReply('An error occurred while fetching lyrics.')
   }
  }
 }
)
bot(
 {
  pattern: 'trim',
  fromMe: mode,
  desc: 'Trim the video or audio',
  type: 'misc',
 },
 async (message, match, m) => {
  if (!message.reply_message || (!message.reply_message.video && !message.reply_message.audio)) {
   return await message.sendMessage('Reply to a media file')
  }
  if (!match) return await message.sendMessage('Give the start and end time in this format: mm:ss|mm:ss')

  const [start, end] = match.split('|')
  if (!start || !end) return await message.sendMessage('Give the start and end time in this format: mm:ss|mm:ss')
  const buffer = await m.quoted.download()
  const startSeconds = parseTimeToSeconds(start)
  const endSeconds = parseTimeToSeconds(end)
  const duration = endSeconds - startSeconds
  const ext = (await fromBuffer(buffer)).ext
  const args = ['-ss', `${startSeconds}`, '-t', `${duration}`, '-c', 'copy']
  const trimmedBuffer = await ffmpeg(buffer, args, ext, ext)
  message.sendFile(trimmedBuffer)
 }
)

bot(
 {
  pattern: 'rmbg',
  fromMe: mode,
  desc: 'Remove background of an image',
  type: 'image',
 },
 async (message, match, m) => {
  if (!config.REMOVEBG) return await message.sendMessage(message.jid, 'Set RemoveBg API Key in config.js \n Get it from https://www.remove.bg/api')
  if (!message.reply_message && !message.reply_message.image) return await message.sendReply('Reply to an image')
  let buff = await m.quoted.download()
  let buffer = await removeBg(buff)
  if (!buffer) return await message.sendReply('An error occured')
  await message.sendMessage(
   message.jid,
   buffer,
   {
    quoted: message.reply_message.key,
    mimetype: 'image/png',
    fileName: 'removebg.png',
   },
   'document'
  )
 }
)
