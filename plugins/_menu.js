command(
 {
  pattern: 'menu',
  fromMe: isPrivate,
  desc: 'Show All Commands',
  dontAddCommandList: true,
  type: 'user',
 },
 async (message, match) => {
  if (match) {
   for (let i of plugins.commands) {
    if (i.pattern instanceof RegExp && i.pattern.test(message.prefix + match)) {
     const cmdName = i.pattern.toString().split(/\W+/)[1]
     message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
 Description: ${i.desc}\`\`\``)
    }
   }
  } else {
   let { prefix } = message
   const data = new Agent()
   const time = data.getCurrentTime()
   const date = data.getCurrentDate()
   const runtime = await data.getRuntime() // Await here
   const os = await data.getOperatingSystem() // Await here

   let menu = `╭━━━━━ᆫ ${BOT_NAME} ᄀ━━━
    ┃ ⎆  *USER*:  ${message.pushName}
    ┃ ⎆  *PREFIX*: ${prefix}
    ┃ ⎆  *HOST NAME*: ${os}
    ┃ ⎆  *DATE*: ${date}
    ┃ ⎆  *TIME*: ${time}
    ┃ ⎆  *COMMANDS*: ${plugins.commands.length} 
    ┃ ⎆  *UPTIME*: ${runtime} 
    ╰━━━━━━━━━━━━━━━\n`

   let cmnd = []
   let cmd
   let category = []
   plugins.commands.map((command, num) => {
    if (command.pattern instanceof RegExp) {
     cmd = command.pattern.toString().split(/\W+/)[1]
    }

    if (!command.dontAddCommandList && cmd !== undefined) {
     let type = command.type ? command.type.toLowerCase() : 'misc'

     cmnd.push({ cmd, type })

     if (!category.includes(type)) category.push(type)
    }
   })
   cmnd.sort()
   category.sort().forEach(cmmd => {
    menu += `\n\t⦿---- *${cmmd.toUpperCase()}* ----⦿\n`
    let comad = cmnd.filter(({ type }) => type == cmmd)
    comad.forEach(({ cmd }) => {
     menu += `\n⛥  _${cmd.trim()}_ `
    })
    menu += `\n`
   })

   menu += `\n`
   menu += `_🔖Send ${prefix}menu <command name> to get detailed information of a specific command._\n*📍Eg:* _${prefix}menu plugin_`
   return await message.sendMessage(message.jid, menu)
  }
 }
)
