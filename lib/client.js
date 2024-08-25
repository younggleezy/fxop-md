const pino = require('pino')
const path = require('path')
const fs = require('fs')
const plugins = require('./plugins')
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason, makeInMemoryStore } = require('astrofx011')
const { PausedChats } = require('./database')
const config = require('../config')
const { serialize, Greetings } = require('./index')
const { Image, Message, Sticker, Video, AllMessage } = require('./Messages')

const { loadMessage, saveMessage, saveChat, getName } = require('./database/StoreDb')

const logger = pino({ level: 'silent' })

const store = makeInMemoryStore({ logger })

store.readFromFile('./_store.json')

setInterval(() => {
 store.writeToFile('./store.json')
}, 10_000)

const connect = async () => {
 const sessionDir = './session'
 if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir)

 const { state, saveCreds } = await useMultiFileAuthState(path.join(__basedir, sessionDir))
 const { version } = await fetchLatestBaileysVersion()

 const client = makeWASocket({
  auth: {
   creds: state.creds,
   keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  printQRInTerminal: true,
  logger,
  browser: Browsers.macOS('Desktop'),
  downloadHistory: false,
  syncFullHistory: false,
  markOnlineOnConnect: false,
  emitOwnEvents: true,
  fireInitQueries: true,
  version,
  getMessage: async key => (loadMessage(key.id) || {}).message || { conversation: null },
 })

 // Bind the store to the WhatsApp client
 store.bind(client.ev)

 client.ev.on('connection.update', handleConnectionUpdate(client))
 client.ev.on('creds.update', saveCreds)
 client.ev.on('group-participants.update', async data => Greetings(data, client))
 client.ev.on('chats.update', async chats => chats.forEach(async chat => await saveChat(chat)))
 client.ev.on('messages.upsert', handleMessages(client))

 const numToJid = num => num + '@s.whatsapp.net'
 const sudo = numToJid(config.SUDO.split(',')[0]) || client.user.id

 function formatError(err) {
  const stack = err.stack || ''
  const lines = stack.split('\n')
  const errorMessage = lines[0]
  const errorLocation = lines[1] ? lines[1].trim() : 'Unknown location'

  const fileName = errorLocation.match(/\((.+?):\d+:\d+\)$/)?.[1] || 'Unknown file'
  const relativeFileName = path.relative(process.cwd(), fileName)

  return {
   message: errorMessage,
   location: `File: ${relativeFileName}`,
   stack: lines.slice(0, 3).join('\n'),
  }
 }

 function suggestSolution(errorType, errorMessage) {
  // Add more error types and solutions as needed
  if (errorMessage.includes('is not defined')) {
   return 'Check if the variable is declared and spelled correctly.'
  } else if (errorMessage.includes('is not a function')) {
   return 'Ensure the function is imported or defined before use.'
  }
  return 'Review the code around the error location and check for typos or logical errors.'
 }

 process.on('unhandledRejection', async err => {
  const { message, location, stack } = formatError(err)
  const solution = suggestSolution('unhandledRejection', message)

  const text = `\`\`\`fxop
 Error Type: Unhandled Rejection
 ${message}
 ${location}
 
 Error Detailed Infomation
 ${stack}
 
 Suggested solution:
 ${solution}
 \`\`\``

  await client.sendMessage(sudo, { text })
 })

 process.on('uncaughtException', async err => {
  const { message, location, stack } = formatError(err)
  const solution = suggestSolution('uncaughtException', message)

  const text = `\`\`\`fxop
 Error Type: Uncaught Exception
 ${message}
 ${location}
 
 Error Detailed Infomation
 ${stack}
 
 Suggested solution:
 ${solution}
 \`\`\``

  await client.sendMessage(sudo, { text })
 })
 return client
}

let reconnectAttempts = 0

const handleConnectionUpdate = conn => async s => {
 const { connection, lastDisconnect } = s
 if (connection === 'connecting') {
  console.log('Connecting to WhatsApp... Please Wait.')
 } else if (connection === 'open') {
  console.log('Login Successful!')
  reconnectAttempts = 0 // reset reconnect attempts on successful connection
  const packageVersion = require('../package.json').version
  const totalPlugins = plugins.commands.length
  const workType = config.WORK_TYPE
  const numToJid = num => num + '@s.whatsapp.net'
  const sudo = numToJid(config.SUDO.split(',')[0]) || conn.user.id
  const str = `\`\`\`fxop connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``
  conn.sendMessage(sudo, { text: str })
 } else if (connection === 'close') {
  const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
  if (shouldReconnect && reconnectAttempts < 5) {
   reconnectAttempts++
   await delay(reconnectAttempts * 5000) // exponential backoff
   console.log('Reconnecting...')
   connect()
  } else {
   console.log('Connection closed. Device logged out or reached max reconnect attempts.')
   process.exit(0)
  }
 }
}

const handleMessages = conn => async m => {
 if (m.type !== 'notify') return
 let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn)
 await saveMessage(m.messages[0], msg.sender)
 if (config.AUTO_READ) await conn.readMessages([msg.key])
 if (config.AUTO_STATUS_READ && msg.from === 'status@broadcast') await conn.readMessages([msg.key])

 let text_msg = msg.body
 if (!msg) return

 const regex = new RegExp(`${config.HANDLERS}( ?resume)`, 'is')
 const isResume = regex.test(text_msg)
 const chatId = msg.from
 const pausedChats = await PausedChats.getPausedChats()

 if (pausedChats.some(pausedChat => pausedChat.chatId === chatId && !isResume)) return

 if (config.LOGS) {
  const logMessage = async msg => {
   if (msg.message === undefined) {
    return // Don't log if the message is undefined
   }

   const senderName = await getName(msg.sender)
   let logString = ''

   if (msg.from.endsWith('@g.us')) {
    const groupMetadata = await conn.groupMetadata(msg.from)
    const groupName = groupMetadata.subject
    logString += `Group: ${groupName}\n`
   }

   logString += `Sender: ${senderName}\n`

   const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || Object.keys(msg.message)[0] // fallback to message type if text is not available

   logString += `Message: ${messageContent}`

   console.log(logString)
  }

  await logMessage(msg)
 }
 var whats
 plugins.commands.map(async command => {
  if (command.fromMe && !msg.sudo) return

  const handleCommand = (Instance, args) => {
   whats = new Instance(conn, msg)
   command.function(whats, ...args, msg, conn, m)
  }

  if (text_msg && command.pattern) {
   let iscommand = text_msg.match(command.pattern)
   if (iscommand) {
    let [, prefix, , match] = iscommand
    match = match ? match : false
    msg.prefix = prefix
    msg.command = [prefix, iscommand[2]].join('')
    handleCommand(Message, [match])
   }
  } else {
   switch (command.on) {
    case 'text':
     if (text_msg) handleCommand(Message, [text_msg])
     break
    case 'image':
     if (msg.type === 'imageMessage') handleCommand(Image, [text_msg])
     break
    case 'sticker':
     if (msg.type === 'stickerMessage') handleCommand(Sticker, [])
     break
    case 'video':
     if (msg.type === 'videoMessage') handleCommand(Video, [])
     break
    case 'delete':
     if (msg.type === 'protocolMessage') {
      whats = new Message(conn, msg)
      whats.messageId = msg.message.protocolMessage.key?.id
      command.function(whats, msg, conn, m)
     }
     break
    case 'message':
     handleCommand(AllMessage, [])
     break
    default:
     break
   }
  }
 })
}

module.exports = { connect, store }
