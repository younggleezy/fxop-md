const { join } = require('path')
const { DATABASE } = require('./config')
const connect = require('./lib/client')
const io = require('socket.io-client')
const { getandRequirePlugins } = require('./lib/database/plugins')
const { fetchFiles, createSession } = require('./lib/Misc')
const chalk = require('chalk')
const RunServer = require('./server')
const { delay } = require('astrofx011')
async function startBot() {
 try {
  const server = new RunServer(8000)
  server.start()
  await createSession()
  await fetchFiles(join(__dirname, '/lib/database/'))
  console.log('Database Synchronized')
  await DATABASE.sync()
  await fetchFiles(join(__dirname, '/plugins/'))
  await getandRequirePlugins()
  delay(3000)
  const ws = io('https://socket-counter.onrender.com/', { reconnection: true })
  ws.on('connect', () => console.log('Connected to server'))
  ws.on('disconnect', () => console.log('Disconnected from server'))

  return await connect()
 } catch (error) {
  console.error('Initialization error:', error)
  return process.exit(1)
 }
}

startBot()
