const { command, parsedJid } = require("../lib");
const { PausedChats, WarnDB } = require("../lib/database");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = WarnDB;
const { getFilter, setFilter, deleteFilter } = require("../lib/database/filters");
const runtime = require("./_patch");
command(
 {
  pattern: "pause",
  fromMe: mode,
  desc: "Pause the chat",
  type: "user",
 },
 async message => {
  const chatId = message.key.remoteJid;
  try {
   await PausedChats.savePausedChat(chatId);
   message.reply("Chat paused successfully.");
  } catch (error) {
   console.error(error);
   message.reply("Error pausing the chat.");
  }
 }
);

command(
 {
  pattern: "resume",
  fromMe: mode,
  desc: "Resume the paused chat",
  type: "user",
 },
 async message => {
  const chatId = message.key.remoteJid;

  try {
   const pausedChat = await PausedChats.PausedChats.findOne({
    where: { chatId },
   });

   if (pausedChat) {
    await pausedChat.destroy();
    message.reply("Chat resumed successfully.");
   } else {
    message.reply("Chat is not paused.");
   }
  } catch (error) {
   console.error(error);
   message.reply("Error resuming the chat.");
  }
 }
);

command(
 {
  pattern: "warn",
  fromMe: mode,
  desc: "Warn a user",
  type: "user",
 },
 async (message, match) => {
  const userId = message.mention[0] || message.reply_message.jid;
  if (!userId) return message.reply("_Mention or reply to someone_");
  let reason = message?.reply_message.text || match;
  reason = reason.replace(/@(\d+)/, "");
  reason = reason ? reason.length <= 1 : "Reason not Provided";

  const warnInfo = await saveWarn(userId, reason);
  let userWarnCount = warnInfo ? warnInfo.warnCount : 0;
  userWarnCount++;
  await message.reply(`_User @${userId.split("@")[0]} warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`, { mentions: [userId] });
  if (userWarnCount > WARN_COUNT) {
   const jid = parsedJid(userId);
   await message.sendMessage(message.jid, "Warn limit exceeded kicking user");
   return await message.client.groupParticipantsUpdate(message.jid, jid, "remove");
  }
  return;
 }
);

command(
 {
  pattern: "rwarn",
  fromMe: mode,
  desc: "Reset warnings for a user",
  type: "user",
 },
 async message => {
  const userId = message.mention[0] || message.reply_message.jid;
  if (!userId) return message.reply("_Mention or reply to someone_");
  await resetWarn(userId);
  return await message.reply(`_Warnings for @${userId.split("@")[0]} reset_`, {
   mentions: [userId],
  });
 }
);

command(
 {
  pattern: "runtime",
  fromMe: mode,
  desc: "Check uptime of bot",
  type: "user",
 },
 async (message, match) => {
  message.reply(`*Uptime: ${runtime(process.uptime())}*`);
 }
);

command(
 {
  pattern: "filter",
  fromMe: mode,
  desc: "Adds a filter. When someone triggers the filter, it sends the corresponding response. To view your filter list, use `.filter`.",
  usage: ".filter keyword:message",
  type: "user",
 },
 async (message, match) => {
  let text, msg;
  try {
   [text, msg] = match.split(":");
  } catch {}
  if (!match) {
   filtreler = await getFilter(message.jid);
   if (filtreler === false) {
    await message.reply("No filters are currently set in this chat.");
   } else {
    var mesaj = "Your active filters for this chat:" + "\n\n";
    filtreler.map(filter => (mesaj += `✒ ${filter.dataValues.pattern}\n`));
    mesaj += "use : .filter keyword:message\nto set a filter";
    await message.reply(mesaj);
   }
  } else if (!text || !msg) {
   return await message.reply("```use : .filter keyword:message\nto set a filter```");
  } else {
   await setFilter(message.jid, text, msg, true);
   return await message.reply(`_Sucessfully set filter for ${text}_`);
  }
 }
);

command(
 {
  pattern: "stop",
  fromMe: mode,
  desc: "Stops a previously added filter.",
  usage: '.stop "hello"',
  type: "user",
 },
 async (message, match) => {
  if (!match) return await message.reply("\n*Example:* ```.stop hello```");

  del = await deleteFilter(message.jid, match);
  await message.reply(`_Filter ${match} deleted_`);

  if (!del) {
   await message.reply("No existing filter matches the provided input.");
  }
 }
);

command({ on: "text", fromMe: false, dontAddCommandList: true }, async (message, match) => {
 var filtreler = await getFilter(message.jid);
 if (!filtreler) return;
 filtreler.map(async filter => {
  pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : "\\b(" + filter.dataValues.pattern + ")\\b", "gm");
  if (pattern.test(match)) {
   return await message.reply(filter.dataValues.text, {
    quoted: message,
   });
  }
 });
});
