const { getPlugins } = require('../lib/plugins')
const { bot, mode, clockString } = require('../lib')
const { BOT_INFO } = require('../config')
const { hostname } = require('os')

bot(
 {
  pattern: 'menu',
  fromMe: mode,
  desc: 'Display All Commands',
  dontAddCommandList: true,
  type: 'user',
 },
 async (message, match) => {
  if (match) {
   for (const command of getPlugins().commands) {
    if (command.pattern instanceof RegExp && command.pattern.test(message.prefix + match)) {
     const commandName = command.pattern.toString().split(/\W+/)[1]
     message.sendReply(`\`\`\`Command: ${message.prefix}${commandName.trim()}
Description: ${command.desc}\`\`\``)
    }
   }
  } else {
   const { prefix } = message
   const [date, time] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).split(',')
   let menuContent = `╭━━━━━ᆫ ${BOT_INFO.split(',')[1]} ᄀ━━━
┃ ⎆  *OWNER*:  ${BOT_INFO.split(',')[0]}
┃ ⎆  *PREFIX*: ${prefix}
┃ ⎆  *HOST NAME*: ${hostname().split('-')[0]}
┃ ⎆  *DATE*: ${date}
┃ ⎆  *TIME*: ${time}
┃ ⎆  *COMMANDS*: ${getPlugins().commands.length} 
┃ ⎆  *UPTIME*: ${clockString(process.uptime())} 
╰━━━━━━━━━━━━━━━\n`

   const commandsList = []
   const categories = []

   getPlugins().commands.forEach(command => {
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
    menuContent += `\n\t⦿---- *${category.toUpperCase()}* ----⦿\n`
    const filteredCommands = commandsList.filter(({ commandType }) => commandType === category)
    filteredCommands.forEach(({ commandName }) => {
     menuContent += `\n⛥  _${commandName.trim()}_ `
    })
    menuContent += `\n`
   })

   menuContent += `\n`
   menuContent += `_🔖Send ${prefix}menu <command name> to get detailed information about a specific command._\n*📍Eg:* _${prefix}menu plugin_`

   return await message.send(menuContent)
  }
 }
)

bot(
 {
  pattern: 'list',
  fromMe: mode,
  desc: 'Display All Commands',
  dontAddCommandList: true,
 },
 async (message, match, { prefix }) => {
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
