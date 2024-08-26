const path = require('path')
const config = require('./config')
const { connect } = require('./lib/client.js')
const fetchFiles = require('./lib/modules.js')
const { getandRequirePlugins } = require('./lib/database/plugins')
global.__basedir = __dirname
const server = require('./server.js')
async function runBot() {
 try {
  await server()
  await fetchFiles(path.join(__dirname, '/lib/database/'))
  console.log('Syncing Database')

  await config.DATABASE.sync()

  console.log('⬇  Installing Plugins...')
  await fetchFiles(path.join(__dirname, '/plugins/'))
  await getandRequirePlugins()
  console.log('✅ Plugins Installed!')
  return await connect()
 } catch (error) {
  console.error('Initialization error:', error)
  return process.exit(1)
 }
}

runBot()
