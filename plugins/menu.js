const plugins = require("../lib/plugins");
const { tiny } = require("../lib/fancy");
const { Module, mode, runtime, formatBytes } = require("../lib");
const { BOT_NAME, HANDLERS } = require("../config");
const os = require("os");
Module(
 {
  pattern: "menu",
  fromMe: mode,
  desc: "Show All Commands",
  dontAddCommandList: true,
  type: "user",
 },
 async (message, commandMatch) => {
  if (commandMatch) {
   for (let command of plugins.commands) {
    if (command.pattern && message.text.startsWith(`${message.prefix}${commandMatch}`)) {
     // Extract command name from the pattern
     const commandName = command.pattern
      .toString()
      .replace(/^\^.*?\s?/, "") // Remove leading part of the regex
      .replace(/(?=\b|$)\)$/g, "") // Remove trailing part of the regex
      .trim();

     message.reply(`\`\`\`Command: ${message.prefix}${commandName}
 Description: ${command.desc}\`\`\``);
    }
   }
  } else {
   const [currentDate, currentTime] = new Date().toLocaleString("en-IN", { timeZone: "Africa/Lagos" }).split(",");
   let menuMessage = `\`\`\`╭━━━〔 ${BOT_NAME} 〕━━━┈⊷
│✷╭──────────────
│✷│User: ${message.pushName}
│✷│Prefix: ${HANDLERS}
│✷│Date: ${currentDate}
│✷│Time: ${currentTime}
│✷│Plugins: ${plugins.commands.length} 
│✷│Runtime: ${runtime(process.uptime())} 
│✷│Ram: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
│✷│Version: ${(version = require("../package.json").version)}
│✷╰──────────────
╰━━━━━━━━━━━━━━━┈⊷\n\`\`\``;

   const commandList = [];
   const categoryList = [];

   plugins.commands.forEach((command) => {
    if (command.pattern) {
     const commandName = command.pattern

     if (commandName) {
      const commandType = command.type ? command.type.toLowerCase() : "misc";
      commandList.push({ commandName, commandType });

      if (!categoryList.includes(commandType)) categoryList.push(commandType);
     }
    }
   });

   // Sorting categories and commands
   categoryList.sort();
   commandList.sort((a, b) => a.commandName.localeCompare(b.commandName));

   categoryList.forEach((category) => {
    menuMessage += `\n╭──〘 ${tiny(category)} 〙━━──⊷\n`;
    const filteredCommands = commandList.filter(({ commandType }) => commandType === category);
    if (filteredCommands.length === 0) {
     menuMessage += `\n_No commands available for this category._\n`;
    } else {
     filteredCommands.forEach(({ commandName }) => {
      menuMessage += `││ ${tiny(commandName.trim())}\n`;
     });
    }
    menuMessage += `│╰───────────\n╰━━━━━━━━━━━━━──⊷\n`;
   });
   menuMessage += `\n`;
   return await message.sendMessage(menuMessage);
  }
 }
);

Module(
 {
  pattern: "list",
  fromMe: mode,
  desc: "Show All Commands",
  type: "user",
  dontAddCommandList: true,
 },
 async (message, match, { prefix }) => {
  let commandListMessage = "\t\t```Command List```\n";

  const commandList = [];
  plugins.commands.forEach((command) => {
   if (command.pattern) {
    // Extract command name from the pattern
    const commandName = command.pattern
     .toString()
     .replace(/^\^.*?\s?/, "") // Remove leading part of the regex
     .replace(/(?=\b|$)\)$/g, "") // Remove trailing part of the regex
     .trim();

    if (commandName) {
     commandList.push({ commandName, description: command.desc || false });
    }
   }
  });

  // Sorting commands
  commandList.sort((a, b) => a.commandName.localeCompare(b.commandName));

  commandList.forEach(({ commandName, description }, index) => {
   commandListMessage += `\`\`\`${index + 1} ${commandName.trim()}\`\`\`\n`;
   if (description) commandListMessage += `Use: \`\`\`${description}\`\`\`\n\n`;
  });

  return await message.reply(commandListMessage);
 }
);
