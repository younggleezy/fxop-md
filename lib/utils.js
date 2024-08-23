const fs = require('fs')
const path = require('path')
const axios = require('axios')
const config = require('../config')

const getJson = async (url, options = {}) => {
 try {
  const response = await axios({
   method: 'GET',
   url: url,
   headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
   },
   ...options,
  })
  return response.data
 } catch (error) {
  return error
 }
}

const postJson = async (url, postData, options = {}) => {
 try {
  const response = await axios.request({
   url: url,
   data: JSON.stringify(postData),
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   ...options,
  })
  return response.data
 } catch (error) {
  return error
 }
}

const writeJsonFiles = (jsonObj, directoryPath) => {
 for (const key in jsonObj) {
  if (jsonObj.hasOwnProperty(key)) {
   const filename = `${key}.json`
   const filePath = path.join(directoryPath, filename)
   const content = JSON.stringify(jsonObj[key], null, 2)
   fs.writeFile(filePath, content, 'utf8', () => {})
  }
 }
}

const formatTime = seconds => {
 seconds = Number(seconds)
 const d = Math.floor(seconds / (3600 * 24))
 const h = Math.floor((seconds % (3600 * 24)) / 3600)
 const m = Math.floor((seconds % 3600) / 60)
 const s = Math.floor(seconds % 60)
 const dDisplay = d > 0 ? `${d} ${d === 1 ? 'day' : 'days'}, ` : ''
 const hDisplay = h > 0 ? `${h} ${h === 1 ? 'hour' : 'hours'}, ` : ''
 const mDisplay = m > 0 ? `${m} ${m === 1 ? 'minute' : 'minutes'}, ` : ''
 const sDisplay = s > 0 ? `${s} ${s === 1 ? 'second' : 'seconds'}` : ''
 return dDisplay + hDisplay + mDisplay + sDisplay
}

const sleep = async ms => {
 return new Promise(resolve => setTimeout(resolve, ms))
}

const numToJid = num => `${num}@s.whatsapp.net`

const sudoIds = async client => {
 return (await client.onWhatsApp(...config.SUDO.split(',').concat(client.user.id))).map(({ jid }) => jid)
}

module.exports = {
 getJson,
 postJson,
 writeJsonFiles,
 formatTime,
 sleep,
 numToJid,
 sudoIds,
}
