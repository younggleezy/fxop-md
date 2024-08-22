const { fetchFiles, createSession } = require('./system')
const { Facebook, Instagram, Twitter, Tiktok } = require('./scraper')
const { server } = require('./tools')
module.exports = {
 Facebook,
 Instagram,
 Twitter,
 Tiktok,
 server,
 fetchFiles,
 createSession,
}
