const { command, mode } = require("../lib");
const antiwordDb = require("../lib/database/antiword");
const antilinkDb = require("../lib/database/antilink");
const antibotDb = require("../lib/database/antibot");

command({
  pattern: 'antiword ?(.*)',
  fromMe: true,
  onlyGroup: true,
  desc: 'set antiword',
  type: 'group'
}, async (message, match) => {
  const chatData = await antiwordDb.findOne({ where: { chatid: message.chat } }) || { word: JSON.stringify(['fuck']), enabled: false };
  const words = JSON.parse(chatData.word);
  
  if (!match) return await message.send('*Need input!*\n_Example: antiword fek,myr..._\n_antiword on/off_');
  if (match === 'list') {
    if (!chatData.enabled) {
      return await message.reply("_You don't set the Antiword yet.!_\n__To set:__ ```.antiword fek,myr...```");
    }
    return await message.reply(words.join(','));
  }
  if (match === 'on' || match === 'off') {
    chatData.enabled = match === 'on';
    await antiwordDb.upsert({ chatid: message.chat, word: JSON.stringify(words), enabled: chatData.enabled });
    return await message.reply(`_Antiword ${match === 'on' ? 'Activated' : 'Deactivated'}_`);
  }
  const antiwords = match.split(',');
  chatData.word = JSON.stringify(antiwords);
  chatData.enabled = true;
  await antiwordDb.upsert({ chatid: message.chat, word: chatData.word, enabled: chatData.enabled });
  return await message.reply('_Antiword Updated_');
});


command(
 {
  pattern: "antilink ?(.*)",
  fromMe: mode,
  desc: "set antilink",
  type: "group",
 },
 async (message, match, client) => {
  const chatData = (await antilinkDb.findOne({ where: { chatid: message.jid } })) || {
   allowed: "gist.github.com",
   enabled: false,
   action: "kick",
  };
  if (!match) return await message.reply("_Need input!_\n*Example:*\n.antilink on/off\n.antilink info\n.antilink google.com,github.com\n.antilink action kick/warn/delete");
  if (match == "info") {
   const isAntiLink = chatData.enabled ? "Enabled" : "Disabled";
   return await message.send(`*Allowed Urls* : ${chatData.allowed}\n*Action* : ${chatData.action}\n*Status* : ${isAntiLink}`);
  }
  if (match == "on" || match == "off") {
   chatData.enabled = match == "on";
   await antilinkDb.upsert({ chatid: message.jid, ...chatData });
   return await message.reply(`_AntiLink ${match == "on" ? "Activated" : "Deactivated"}_`);
  }
  if (match.includes("action")) {
   let action = match.match(/action[\/\\](?:d(?:elete|lt)|warn|null|kick)/g);
   if (action) {
    action = action[0].split(/[\/\\]/);
    chatData.action = action[1];
    await antilinkDb.upsert({ chatid: message.jid, ...chatData });
    return await message.send(`_AntiLink action updated : *${["kick", "warn", "delete", "dlt", "null"].includes(action[1]) ? action[1] : "false"}*_`);
   }
  }
  chatData.allowed = match;
  chatData.enabled = true;
  await antilinkDb.upsert({ chatid: message.jid, ...chatData });
  return await message.reply("_AntiLink allowed urls Updated_");
 }
);

command(
 {
  pattern: "antibot ?(.*)",
  fromMe: mode,
  desc: "set antibot",
  type: "group",
 },
 async (message, match, client) => {
  if (!match || (match !== "on" && match !== "off")) return await message.reply('_Please provide a valid match option._ *Use either "on" or "off".*');
  if (match === "on") {
   await antibotDb.upsert({ chatid: message.chat, active: true });
   await message.send("_Antibot Activated_");
  } else if (match === "off") {
   await antibotDb.destroy({ where: { chatid: message.chat } });
   await message.send("_Antibot Deactivated_");
  }
 }
);
