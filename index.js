const fs = require('fs').promises
const path = require('path')
const config = require('./config')
const connect = require('./lib/connection')
const { loadSession } = require('baileys')
const io = require('socket.io-client')
const { getandRequirePlugins } = require('./source/database/plugins')
const { fetchFiles } = require('./lib/Misc')
async function initialize() {
 try {
  if (config.SESSION_ID && !fs.existsSync('session')) {
   console.log('loading session from session id...')
   fs.mkdirSync('./session')
   const credsData = await loadSession(config.SESSION_ID)
   fs.writeFileSync('./session/creds.json', JSON.stringify(credsData.creds, null, 2))
  }
  await fetchFiles(path.join(__dirname, '/source/database/'))
  console.log('Syncing Database')

  await config.DATABASE.sync()

  console.log('⬇  Installing Plugins...')
  await fetchFiles(path.join(__dirname, '/source/plugins/'))
  await getandRequirePlugins()
  console.log('✅ Plugins Installed!')
  const ws = io('https://socket.xasena.me/', { reconnection: true })
  ws.on('connect', () => console.log('Connected to server'))
  ws.on('disconnect', () => console.log('Disconnected from server'))
  return await connect()
 } catch (error) {
  console.error('Initialization error:', error)
  return process.exit(1) // Exit with error status
 }
}

initialize()
