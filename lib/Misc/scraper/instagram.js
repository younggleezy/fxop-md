const fetch = require('node-fetch')
const config = require('../../../config')

class Instagram {
 constructor(apiUrl = config.BASE_API + '/download/instagram?url=') {
  this.apiUrl = apiUrl
 }

 async download(url) {
  try {
   const response = await fetch(`${this.apiUrl}${encodeURIComponent(url)}`)
   if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
   }
   const data = await response.json()
   return data.url
  } catch (error) {
   console.error('Failed to download:', error)
   return null
  }
 }
}
module.exports = Instagram

// const downloader = new Instagram()
// downloader.download('https://www.instagram.com/reel/C9bjQfRprHK/?img_index=we.are.messi').then(data => {
//  if (data) {
//   console.log('Download successful:', data)
//  } else {
//   console.log('Download failed')
//  }
// })
