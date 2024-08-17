const Facebook = require('./scraper/facebook')
const Socket = require('./tools/socket')
const fetchFiles = require('./system/require')
const Instagram = require('./scraper/instagram')
const labs = require('./scraper/labs')
module.exports = {
 Facebook,
 Instagram,
 Socket,
 fetchFiles,
 labs
}
