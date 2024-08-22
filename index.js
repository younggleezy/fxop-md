const path = require('path')
const config = require('./config')
const connect = require('./lib/client')
const io = require('socket.io-client')
const { getandRequirePlugins } = require('./lib/database/plugins')
const { fetchFiles, createSession } = require('./lib/Misc')
const { delay } = require('astrofx011')
const RunServer = require('./server')
async function startBot() {
 try {
  const server = new RunServer(8000)
  server.start()
  delay(3000)
  await createSession()
  await fetchFiles(path.join(__dirname, '/lib/database/'))
  console.log('Syncing Database')
  await config.DATABASE.sync()
  console.log('⬇  Installing Plugins...')
  await fetchFiles(path.join(__dirname, '/plugins/'))
  await getandRequirePlugins()
  console.log('Plugins Installed!')

  const ws = io('https://socket-counter.onrender.com/', { reconnection: true })
  ws.on('connect', () => console.log('Connected to server'))
  ws.on('disconnect', () => console.log('Disconnected from server'))

  return await connect()
 } catch (error) {
  console.error('Initialization error:', error)
  return process.exit(1) // Exit with error status
 }
}

startBot()
