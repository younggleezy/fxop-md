const { bot, mode } = require('../lib/')
const axios = require('axios')
const fs = require('fs')
const { PluginDB, installPlugin } = require('../lib/database').Plugins
const { exec } = require('child_process')
const { formatTime } = require('../lib/utils')
const config = require('../config')
const { PROCESSNAME } = require('../config')
const simplegit = require('simple-git')
const git = simplegit()
var branch = config.BRANCH

bot(
 {
  pattern: 'ping ?(.*)',
  fromMe: mode,
  desc: 'Bot response in milliseconds.',
  type: 'system',
 },
 async message => {
  const start = new Date().getTime()
  const msg = await message.reply('*ᴩɪɴɢ...*')
  const end = new Date().getTime()
  const responseTime = (end - start) / 1000
  await msg.edit(`*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ ${responseTime} secs*`)
 }
)

bot(
 {
  pattern: 'runtime',
  fromMe: mode,
  desc: 'Check uptime of bot',
  type: 'system',
 },
 async message => {
  message.sendReply(`Uptime: ${formatTime(process.uptime())}`)
 }
)

bot(
 {
  pattern: 'install',
  fromMe: true,
  desc: 'Installs External plugins',
  type: 'system',
 },
 async (message, match) => {
  if (!match) return await message.sendReply('_Send a plugin url_')
  try {
   var url = new URL(match)
  } catch (e) {
   console.log(e)
   return await message.sendMessage(message.jid, '_Invalid Url_')
  }

  if (url.host === 'gist.github.com') {
   url.host = 'gist.githubusercontent.com'
   url = url.toString() + '/raw'
  } else {
   url = url.toString()
  }

  var plugin_name
  try {
   const { data, status } = await axios.get(url)
   if (status === 200) {
    var comand = data.match(/(?<=pattern:) ["'](.*?)["']/)
    plugin_name = comand[0].replace(/["']/g, '').trim().split(' ')[0]
    if (!plugin_name) {
     plugin_name = '__' + Math.random().toString(36).substring(8)
    }
    fs.writeFileSync(__dirname + '/' + plugin_name + '.js', data)
    try {
     require('./' + plugin_name)
    } catch (e) {
     fs.unlinkSync(__dirname + '/' + plugin_name + '.js')
     return await message.sendMessage(message.jid, 'Invalid Plugin\n ```' + e + '```')
    }

    await installPlugin(url, plugin_name)

    await message.sendMessage(message.jid, `_New plugin installed : ${plugin_name}_`)
   }
  } catch (error) {
   console.error(error)
   return await message.sendMessage(message.jid, 'Failed to fetch plugin')
  }
 }
)

bot(
 {
  pattern: 'plugin',
  fromMe: true,
  desc: 'plugin list',
  type: 'system',
 },
 async message => {
  var mesaj = ''
  var plugins = await PluginDB.findAll()
  if (plugins.length < 1) {
   return await message.sendMessage(message.jid, '_No external plugins installed_')
  } else {
   plugins.map(plugin => {
    mesaj += '```' + plugin.dataValues.name + '```: ' + plugin.dataValues.url + '\n'
   })
   return await message.sendMessage(message.jid, mesaj)
  }
 }
)

bot(
 {
  pattern: 'remove',
  fromMe: true,
  desc: 'Remove external plugins',
  type: 'system',
 },
 async (message, match) => {
  if (!match) return await message.sendMessage(message.jid, '_Need a plugin name_')

  var plugin = await PluginDB.findAll({ where: { name: match } })

  if (plugin.length < 1) {
   return await message.sendMessage(message.jid, '_Plugin not found_')
  } else {
   await plugin[0].destroy()
   delete require.cache[require.resolve('./' + match + '.js')]
   fs.unlinkSync(__dirname + '/' + match + '.js')
   await message.sendMessage(message.jid, `Plugin ${match} deleted`)
  }
 }
)

bot(
 {
  pattern: 'shutdown',
  fromMe: true,
  desc: 'stops the bot',
  type: 'system',
 },
 async message => {
  await message.sendMessage(message.jid, 'shutting down...')
  exec('pm2 stop fxop-md', error => {
   if (error) {
    return message.sendMessage(message.jid, `Error: ${error}`)
   }
   return
  })
 }
)

bot(
 {
  pattern: 'restart',
  fromMe: true,
  desc: 'Restart the bot',
  type: 'system',
 },
 async messsage => {
  await messsage.sendMessage(messsage.jid, 'restarting process...')
  exec('pm2 restart fxop-md', error => {
   if (error) {
    return messsage.sendMessage(messsage.jid, `Error: ${error}`)
   }
  })
 }
)

bot(
 {
  pattern: 'update',
  fromMe: true,
  desc: 'Update the bot',
  type: 'system',
 },
 async (message, match) => {
  prefix = message.prefix
  await git.fetch()

  var commits = await git.log([branch + '..origin/' + branch])
  if (match === 'now') {
   if (commits.total === 0) {
    return await message.sendMessage(message.jid, '```No changes in the latest commit```')
   }
   await message.sendMessage(message.jid, '*Updating...*')
   exec('git stash && git pull origin ' + config.BRANCH, async (err, stderr) => {
    if (err) {
     return await message.sendMessage(message.jid, '```' + stderr + '```')
    }
    await message.sendMessage(message.jid, '*Restarting...*')
    let dependancy = await updatedDependencies()
    if (dependancy) {
     await message.sendReply('*Dependancies changed installing new dependancies *')
     await message.sendReply('*Restarting...*')
     exec('npm install && pm2 restart ' + PROCESSNAME, async (err, stdout, stderr) => {
      if (err) {
       return await message.sendMessage(message.jid, '```' + stderr + '```')
      }
     })
    } else {
     await message.sendReply('*Restarting...*')
     exec('pm2 restart ' + PROCESSNAME, async (err, stdout, stderr) => {
      if (err) {
       return await message.sendMessage(message.jid, '```' + stderr + '```')
      }
     })
    }
   })
  } else {
   if (commits.total === 0) {
    return await message.sendMessage(message.jid, '```No changes in the latest commit```')
   } else {
    let changes = '_New update available!_\n\n'
    changes += '*Commits:* ```' + commits.total + '```\n'
    changes += '*Branch:* ```' + branch + '```\n'
    changes += '*Changes:* \n'
    commits.all.forEach((commit, index) => {
     changes += '```' + (index + 1) + '. ' + commit.message + '```\n'
    })
    changes += '\n*To update, send* ```' + prefix + 'update now```'
    await message.sendMessage(message.jid, changes)
   }
  }
 }
)

async function updatedDependencies() {
 try {
  const diff = await git.diff([`${branch}..origin/${branch}`])
  const hasDependencyChanges = diff.includes('"dependencies":')
  return hasDependencyChanges
 } catch (error) {
  console.error('Error occurred while checking package.json:', error)
  return false
 }
}
