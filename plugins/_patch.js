const os = require("os");
const axios = require("axios");
const plugins = require("../lib/plugins");
const { command, tiny, formatBytes, mode } = require("../lib");
const { BOT_INFO, TIME_ZONE } = require("../config");

async function getBuffer(url) {
 try {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 } catch (error) {
  console.error(`Error fetching buffer: ${error}`);
  throw error;
 }
}

const runtime = seconds => {
 const d = Math.floor(seconds / (3600 * 24));
 const h = Math.floor((seconds % (3600 * 24)) / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = Math.floor(seconds % 60);
 return `${d > 0 ? d + " d " : ""}${h > 0 ? h + " h " : ""}${m > 0 ? m + " m " : ""}${s > 0 ? s + " s" : ""}`;
};

command(
 {
  pattern: "menu",
  fromMe: mode,
  desc: "Show All Commands",
  type: "user",
 },
 async (message, match) => {
  if (match) {
   const matchedCommands = plugins.commands.filter(i => i.pattern instanceof RegExp && i.pattern.test(message.prefix + match));
   matchedCommands.forEach(i => {
    const cmdName = i.pattern.toString().split(/\W+/)[1];
    message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}\nDescription: ${i.desc}\`\`\``);
   });
   return;
  }

  const { prefix } = message;
  const [date, time] = new Date().toLocaleString("en-IN", { timeZone: TIME_ZONE }).split(",");
  let menu = `\`\`\`╭━━━ ${BOT_INFO.split(";")[1]} ━━━┈⊷
││ User:  ${message.pushName}
││ Prefix: ${prefix}
││ Date: ${date}
││ Time: ${time}
││ Plugins: ${plugins.commands.length} 
││ Uptime: ${runtime(process.uptime())} 
││ Ram: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
││ Version: ${require("../package.json").version}
│╰──────────────
╰━━━━━━━━━━━━━━━┈⊷\`\`\`\n`;

  const categorizedCommands = plugins.commands.reduce((acc, command) => {
   if (command.pattern instanceof RegExp && !command.dontAddCommandList) {
    const cmd = command.pattern.toString().split(/\W+/)[1];
    const type = (command.type || "misc").toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(tiny(cmd));
   }
   return acc;
  }, {});

  Object.keys(categorizedCommands)
   .sort()
   .forEach(category => {
    menu += `\n╭── *${tiny(category)}* ━━──⊷\n│╭──────────────\n`;
    categorizedCommands[category].forEach(cmd => {
     menu += `││ ${cmd}\n`;
    });
    menu += `│╰───────────\n╰━━━━━━━━━━━━━──⊷\n`;
   });

  const menuMedia = BOT_INFO.split(";")[2];
  if (!menuMedia) {
   message.send(menu, {
    contextInfo: {
     forwardingScore: 1,
     isForwarded: true,
     forwardedNewsletterMessageInfo: { newsletterJid: "120363327841612745@newsletter", newsletterName: "ᴘᴀᴛᴄʜ 𝟸.𝟻.𝟶" },
    },
   });
  } else {
   try {
    const buff = await getBuffer(menuMedia);
    message.send(buff, {
     caption: menu,
     contextInfo: {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: { newsletterJid: "120363327841612745@newsletter", newsletterName: "ᴘᴀᴛᴄʜ 𝟸.𝟻.𝟶" },
     },
    });
   } catch (error) {
    console.error("Failed to send media:", error);
    message.send(menu);
   }
  }
 }
);

command(
 {
  pattern: "list",
  fromMe: mode,
  desc: "Show All Commands",
  dontAddCommandList: true,
 },
 async (message, match, { prefix }) => {
  let menu = "\t\t```Command List```\n";
  const commands = plugins.commands
   .filter(command => command.pattern && !command.dontAddCommandList)
   .map(command => ({ cmd: command.pattern.toString().split(/\W+/)[1], desc: command.desc || "" }))
   .sort((a, b) => a.cmd.localeCompare(b.cmd));

  commands.forEach(({ cmd, desc }, index) => {
   menu += `\`\`\`${index + 1} ${cmd.trim()}\`\`\`\n`;
   if (desc) menu += `Use: \`\`\`${desc}\`\`\`\n\n`;
  });

  await message.reply(menu);
 }
);

module.exports = runtime;
