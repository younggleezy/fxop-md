// const { bot } = require('../lib')
// const { Google } = require('../lib/Misc')
// bot(
//  {
//   pattern: 'google',
//   info: 'Search Google',
//   type: 'search',
//  },
//  async (message, match) => {
//   if (!match) return message.sendReply('_provide a search query!_')
//   await message.sendReply('_searching google web_')
//   const results = new Google()
//   const info = results.search(match)
//   return message.send(info)
//  }
// )
// bot(
//  {
//   pattern: 'bing',
//   info: 'Search Bing',
//   type: 'search',
//  },
//  async (message, match) => {
//   if (!match) return await message.sendReply('_provide a search query!_')
//   await message.sendReply('_searching bing web_')
//  }
// )
