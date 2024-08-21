const got = require('got')
const Heroku = require('heroku-client')
const { bot } = require('../lib/')
const Config = require('../config')
const heroku = new Heroku({ token: Config.HEROKU_API_KEY })
const baseURI = '/apps/' + Config.HEROKU_APP_NAME
const { secondsToDHMS } = require('../lib/functions')
const { delay } = require('baileys')

bot(
 {
  pattern: 'reboot',
  fromMe: true,
  type: 'heroku',
  desc: 'Restart Dyno',
  type: 'heroku',
 },
 async message => {
  await message.sendReply(`_Restarting_`)
  if (Config.HEROKU) {
   if (Config.HEROKU_APP_NAME === '') {
    return await message.sendReply('Add `HEROKU_APP_NAME` env variable')
   }
   if (Config.HEROKU_API_KEY === '') {
    return await message.sendReply('Add `HEROKU_API_KEY` env variable')
   }
   await heroku.delete(baseURI + '/dynos').catch(async error => {
    await message.sendReply(`HEROKU : ${error.body.message}`)
   })
  } else {
   require('child_process').exec('pm2 restart ' + Config.PROCESSNAME, (error, stdout, stderr) => {
    if (error) {
     return message.sendMessage(message.jid, `Error: ${error}`)
    }
    return
   })
  }
 }
)
bot(
 {
  pattern: 'shutdown',
  fromMe: true,
  type: 'heroku',
  desc: 'Dyno off',
  type: 'heroku',
 },
 async message => {
  if (Config.HEROKU) {
   if (Config.HEROKU_APP_NAME === '') {
    return await message.sendReply('Add `HEROKU_APP_NAME` env variable')
   }
   if (Config.HEROKU_API_KEY === '') {
    return await message.sendReply('Add `HEROKU_API_KEY` env variable')
   }
   await heroku
    .get(baseURI + '/formation')
    .then(async formation => {
     await message.sendReply(`_Shutting down._`)
     await heroku.patch(baseURI + '/formation/' + formation[0].id, {
      body: {
       quantity: 0,
      },
     })
    })
    .catch(async error => {
     await message.sendReply(`HEROKU : ${error.body.message}`)
    })
  } else {
   await message.sendReply(`_Shutting down._`)
   await delay(1000).then(() => process.exit(0))
  }
 }
)

bot(
 {
  pattern: 'dyno',
  fromMe: true,
  desc: 'Show Quota info',
  type: 'heroku',
 },
 async message => {
  if (!Config.HEROKU) return await message.sendReply('You are not using Heroku as your server.')

  if (Config.HEROKU_APP_NAME === '') return await message.sendReply('Add `HEROKU_APP_NAME` env variable')
  if (Config.HEROKU_API_KEY === '') return await message.sendReply('Add `HEROKU_API_KEY env variable')

  try {
   heroku
    .get('/account')
    .then(async account => {
     const url = `https://api.heroku.com/accounts/${account.id}/actions/get-quota`
     headers = {
      'User-Agent': 'Chrome/80.0.3987.149 Mobile Safari/537.36',
      Authorization: 'Bearer ' + Config.HEROKU_API_KEY,
      Accept: 'application/vnd.heroku+json; version=3.account-quotas',
     }
     const res = await got(url, { headers })
     const resp = JSON.parse(res.body)
     const total_quota = Math.floor(resp.account_quota)
     const quota_used = Math.floor(resp.quota_used)
     const remaining = total_quota - quota_used
     const quota = `Total Quota : ${secondsToDHMS(total_quota)}
Used  Quota : ${secondsToDHMS(quota_used)}
Remaning    : ${secondsToDHMS(remaining)}`
     await message.sendReply('```' + quota + '```')
    })
    .catch(async error => {
     return await message.sendReply(`HEROKU : ${error.body.message}`)
    })
  } catch (error) {
   await message.sendReply(error)
  }
 }
)
