const plugins = require("../lib/plugins");
const { command, mode, clockString, tiny, formatBytes } = require("../lib");
const { BOT_INFO } = require("../config");
const os = require("os");

command(
 {
  pattern: "menu",
  fromMe: mode,
  desc: "Show All Commands",
  dontAddCommandList: true,
  type: "user",
 },
 async (message, match) => {
  if (match) {
   for (let i of plugins.commands) {
    if (i.pattern instanceof RegExp && i.pattern.test(message.prefix + match)) {
     const cmdName = i.pattern.toString().split(/\W+/)[1];
     message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
    }
   }
  } else {
   let { prefix } = message;
   let [date, time] = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(",");
   let menu = `╭━━━ ${BOT_INFO.split(";")[1]} ━━━┈⊷
││USER:  ${message.pushName}
││PREFIX: ${prefix}
││DATE: ${date}
││TIME: ${time}
││PLUGINS: ${plugins.commands.length} 
││UPTIME: ${clockString(process.uptime())} 
││RAM: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
││VERSION: ${(version = require("../package.json").version)}
│╰──────────────
╰━━━━━━━━━━━━━━━┈⊷\n`;
   let cmnd = [];
   let cmd;
   let category = [];
   plugins.commands.map((command, num) => {
    if (command.pattern instanceof RegExp) {
     cmd = command.pattern.toString().split(/\W+/)[1];
    }

    if (!command.dontAddCommandList && cmd !== undefined) {
     let type = command.type ? command.type.toLowerCase() : "misc";

     cmnd.push({ cmd, type });

     if (!category.includes(type)) category.push(type);
    }
   });
   cmnd.sort();
   category.sort().forEach(cmmd => {
    menu += `\n╭── *${tiny(cmmd)}* ━━──⊷\n│╭──────────────\n`;
    let comad = cmnd.filter(({ type }) => type == cmmd);
    comad.forEach(({ cmd }) => {
     menu += `││ ${tiny(cmd.trim())}`;
    });
    menu += `│╰───────────\n╰━━━━━━━━━━━━━──⊷\n`;
   });

   menu += `\n`;
   return await message.sendMessage(message.jid, menu);
  }
 }
);

command(
 {
  pattern: "list",
  fromMe: mode,
  desc: "Show All Commands",
  type: "user",
  dontAddCommandList: true,
 },
 async (message, match, { prefix }) => {
  let menu = "\t\t```Command List```\n";

  let cmnd = [];
  let cmd, desc;
  plugins.commands.map(command => {
   if (command.pattern) {
    cmd = command.pattern.toString().split(/\W+/)[1];
   }
   desc = command.desc || false;

   if (!command.dontAddCommandList && cmd !== undefined) {
    cmnd.push({ cmd, desc });
   }
  });
  cmnd.sort();
  cmnd.forEach(({ cmd, desc }, num) => {
   menu += `\`\`\`${(num += 1)} ${cmd.trim()}\`\`\`\n`;
   if (desc) menu += `Use: \`\`\`${desc}\`\`\`\n\n`;
  });
  menu += ``;
  return await message.reply(menu);
 }
);
