const axios = require('axios')
const config = require('../../../config')
class Tiktok {
 constructor(query) {
  this.query = query
 }

 async download() {
  try {
   const response = await axios.get(config.BASE_API + '/download/tiktok?url=', {
    params: { url: this.query },
    responseType: 'arraybuffer',
   })

   if (response.data && response.status === 200 && response.data.success) {
    return {
     creator: response.data.creator,
     status: response.data.status,
     buffer: Buffer.from(response.data.url, 'utf-8'),
    }
   } else {
    throw new Error('Failed to download TikTok video')
   }
  } catch (error) {
   console.error('Error:', error.message)
   return null
  }
 }
}
module.exports = Tiktok
