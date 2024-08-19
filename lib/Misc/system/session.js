const { Buffer } = require('buffer')
const config = require('../../../config')

class createSession {
 constructor() {
  this.sessionId = config.SESSION_ID
 }

 // Function to validate if the current directory is a Git repository
 async validateBot() {
  const git = require('simple-git')()
  try {
   const remotes = await git.getRemotes(true)
   const originRemote = remotes.find(remote => remote.name === 'origin')
   if (originRemote && originRemote.refs.fetch === 'https://github.com/FXastro/fxop-md') {
    console.log('Valid Git repository.')
   } else {
    console.log('Invalid Git repository. Exiting in 30 seconds...')
    await this.sleep(30000)
    process.exit(1)
   }
  } catch (error) {
   console.error('Error validating Git repository:', error)
   process.exit(1)
  }
 }

 // Function to connect session by decoding base64 string and writing to creds.json
 async connectSession() {
  const fs = require('fs')
  try {
   const decodedData = Buffer.from(this.sessionId, 'base64').toString('utf8')
   await fs.promises.writeFile('creds.json', decodedData)
   console.log('Session connected and credentials saved to creds.json.')
  } catch (error) {
   console.error('Error connecting session:', error)
   process.exit(1)
  }
 }

 // Function to find the current operating system name
 getOSName() {
  const os = require('os')
  const platform = os.platform()
  const osNames = {
   win32: 'Windows',
   linux: 'Linux',
   darwin: 'macOS',
  }
  return osNames[platform] || 'VPS Container'
 }

 // Helper function to sleep for a specified time
 sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
 }
}
module.exports = createSession
