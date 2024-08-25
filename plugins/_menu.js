var { commands, command } = require('../lib/plugins')
const { bot, mode, formatBytes } = require('../lib')
const { BOT_INFO, WORK_TYPE } = require('../config')
const os = require('os')
const version = require('../package.json').version
const { tiny } = require('../lib/fancy')

command(
 {
  pattern: 'menu',
  fromMe: mode,
  desc: 'Display All Commands',
  dontAddCommandList: true,
  type: 'user',
 },
 async (message, match) => {
  if (match) {
   for (const command of commands) {
    if (command.pattern instanceof RegExp && command.pattern.test(message.prefix + match)) {
     const commandName = command.pattern.toString().split(/\W+/)[1]
     message.sendReply(`\`\`\`Command: ${message.prefix}${commandName.trim()}
Description: ${command.desc}\`\`\``)
    }
   }
  } else {
   const { prefix } = message
   let menuContent = `\`\`\`╭━━━〔 ${BOT_INFO.split(',')[1]} 〕━━━┈⊷
│ Owner : ${BOT_INFO.split(',')[0]}
│ User : ${message.pushName.replace(/[\r\n]+/gm, '')}
│ Plugins : ${commands.length}
│ Runtime : ${runtime(process.uptime())}
│ Mode : ${WORK_TYPE}
│ Platform : ${getOSName()}
│ Ram : ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
│ Version : ${version}
╰━━━━━━━━━━━━━━━┈⊷\n\`\`\``

   const commandsList = []
   const categories = []

   commands.forEach(command => {
    let commandName
    if (command.pattern instanceof RegExp) {
     commandName = command.pattern.toString().split(/\W+/)[1]
    }

    if (!command.dontAddCommandList && commandName !== undefined) {
     const commandType = command.type ? command.type.toLowerCase() : 'misc'
     commandsList.push({ commandName, commandType })

     if (!categories.includes(commandType)) {
      categories.push(commandType)
     }
    }
   })

   commandsList.sort((a, b) => a.commandName.localeCompare(b.commandName))
   categories.sort()

   categories.forEach(category => {
    menuContent += `\`\`\`\n〔 ${tiny(category)} 〕\n│╭──────────────\`\`\``
    const filteredCommands = commandsList.filter(({ commandType }) => commandType === category)
    filteredCommands.forEach(({ commandName }) => {
     menuContent += `\`\`\`\n│◦  ${tiny(commandName.trim())} \`\`\``
    })
    menuContent += `\`\`\`\n│╰────────────┈⊷
╰─────────────┈⊷\`\`\``
   })
   return await message.send(menuContent)
  }
 }
)

command(
 {
  pattern: 'list',
  fromMe: mode,
  desc: 'Display All Commands',
  dontAddCommandList: true,
 },
 async message => {
  let commandListContent = '\t\t```Command List```\n'

  const commandList = []

  getPlugins().commands.forEach(command => {
   let commandName, commandDescription
   if (command.pattern) {
    commandName = command.pattern.toString().split(/\W+/)[1]
   }
   commandDescription = command.desc || ''

   if (!command.dontAddCommandList && commandName !== undefined) {
    commandList.push({ commandName, commandDescription })
   }
  })

  commandList.sort((a, b) => a.commandName.localeCompare(b.commandName))

  commandList.forEach(({ commandName, commandDescription }, index) => {
   commandListContent += `\`\`\`${index + 1} ${commandName.trim()}\`\`\`\n`
   if (commandDescription) {
    commandListContent += `Use: \`\`\`${commandDescription}\`\`\`\n\n`
   }
  })

  return await message.sendReply(commandListContent)
 }
)

const getOSName = function () {
 const platform = os.platform()
 const osNames = {
  win32: 'Windows',
  linux: 'Linux',
  darwin: 'macOS',
 }
 return osNames[platform] || 'VPS Container'
}

const runtime = function (seconds) {
 seconds = Number(seconds)
 var d = Math.floor(seconds / (3600 * 24))
 var h = Math.floor((seconds % (3600 * 24)) / 3600)
 var m = Math.floor((seconds % 3600) / 60)
 var s = Math.floor(seconds % 60)
 var dDisplay = d > 0 ? d + (d == 1 ? ' d ' : ' d ') : ''
 var hDisplay = h > 0 ? h + (h == 1 ? ' h ' : ' h ') : ''
 var mDisplay = m > 0 ? m + (m == 1 ? ' m ' : ' m ') : ''
 var sDisplay = s > 0 ? s + (s == 1 ? ' s' : ' s') : ''
 return dDisplay + hDisplay + mDisplay + sDisplay
}

module.exports = runtime
