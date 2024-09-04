const os = require("os");
const axios = require("axios");
const plugins = require("../lib/plugins");
const { command, mode, tiny, formatBytes } = require("../lib");
const { BOT_INFO } = require("../config");

async function getBuffer(url) {
 const response = await axios.get(url, { responseType: "arraybuffer" });
 return Buffer.from(response.data);
}
const runtime = function (seconds) {
 seconds = Number(seconds);
 var d = Math.floor(seconds / (3600 * 24));
 var h = Math.floor((seconds % (3600 * 24)) / 3600);
 var m = Math.floor((seconds % 3600) / 60);
 var s = Math.floor(seconds % 60);
 var dDisplay = d > 0 ? d + (d == 1 ? " d " : " d ") : "";
 var hDisplay = h > 0 ? h + (h == 1 ? " h " : " h ") : "";
 var mDisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : "";
 var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
 return dDisplay + hDisplay + mDisplay + sDisplay;
};

command(
 {
  pattern: "menu",
  fromMe: true,
  desc: "Show All Commands",
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
   let menu = `\`\`\`╭━━━ ${BOT_INFO.split(";")[1]} ━━━┈⊷
││ User:  ${message.pushName}
││ Prefix: ${prefix}
││ Date: ${date}
││ Time: ${time}
││ Plugins: ${plugins.commands.length} 
││ Uptime: ${runtime(process.uptime())} 
││ Ram: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
││ Version: ${(version = require("../package.json").version)}
│╰──────────────
╰━━━━━━━━━━━━━━━┈⊷\`\`\`\n`;
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
     menu += `││ ${tiny(cmd.trim())}\n`;
    });
    menu += `│╰───────────\n╰━━━━━━━━━━━━━──⊷\n`;
   });

   menu += `\n`;
   const menuMedia = BOT_INFO.split(";")[2];
   if (!menuMedia) {
    return message.send(menu, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363327841612745@newsletter", newsletterName: "ᴘᴀᴛᴄʜ 𝟸.𝟻.𝟶" } } });
   } else {
    const buff = await getBuffer(menuMedia);
    return message.send(buff, { caption: menu, contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363327841612745@newsletter", newsletterName: "ᴘᴀᴛᴄʜ 𝟸.𝟻.𝟶" } } });
   }
  }
 }
);

command(
 {
  pattern: "list",
  fromMe: true,
  desc: "Show All Commands",
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
module.exports = runtime;
