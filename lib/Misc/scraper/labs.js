const { ElevenLabsClient } = require('elevenlabs')
const dotenv = require('dotenv')
const config = require('../../../config')
dotenv.config()

const ELEVENLABS_API_KEY = config.LABS

const client = new ElevenLabsClient({
 apiKey: ELEVENLABS_API_KEY,
})

const labs = async text => {
 try {
  const audio = await client.generate({
   voice: 'Rachel',
   model_id: 'eleven_turbo_v2_5',
   text,
  })

  const chunks = []
  audio.on('data', chunk => chunks.push(chunk))
  audio.on('end', () => {
   const buffer = Buffer.concat(chunks)
   return buffer
  })

  return new Promise((resolve, reject) => {
   audio.on('error', reject)
   audio.on('end', () => resolve(Buffer.concat(chunks)))
  })
 } catch (error) {
  throw new Error(`Error generating audio: ${error.message}`)
 }
}

module.exports = labs

// labs('This is James').then((buffer) => {
//   console.log('Buffer:', buffer);
// }).catch(console.error);
