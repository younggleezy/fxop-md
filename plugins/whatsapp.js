const { command, mode, serialize, parsedJid } = require("../lib/");
const { DELETED_LOG_CHAT, DELETED_LOG, STATUS_SAVER } = require("../config");
const { loadMessage, getName } = require("../lib/database/StoreDb");

command(
 {
  pattern: "vv",
  fromMe: true,
  desc: "Forwards The View once messsage",
  type: "whatsapp",
 },
 async (message, match, m) => {
  let buff = await m.quoted.download();
  return await message.sendFile(buff);
 }
);

command(
 {
  on: "text",
  fromMe: !STATUS_SAVER,
  desc: "Save or Give Status Updates",
  dontAddCommandList: true,
  type: "whatsapp",
 },
 async (message, match, m) => {
  try {
   if (message.isGroup) return;
   const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
   const cmdz = match.toLowerCase().split(" ")[0];
   if (triggerKeywords.some(tr => cmdz.includes(tr))) {
    const relayOptions = { messageId: m.quoted.key.id };
    return await message.client.relayMessage(message.jid, m.quoted.message, relayOptions);
   }
  } catch (error) {
   console.error("[Error]:", error);
  }
 }
);
command(
 {
  pattern: "setpp",
  fromMe: true,
  desc: "Set profile picture",
  type: "whatsapp",
 },
 async (message, match, m) => {
  if (!message.reply_message.image) return await message.reply("_Reply to a photo_");
  let buff = await m.quoted.download();
  await message.setPP(message.user, buff);
  return await message.reply("_Profile Picture Updated_");
 }
);

command(
 {
  pattern: "rpp",
  fromMe: true,
  desc: "Removes Profile picture",
  type: "whatsapp",
 },
 async (message, match) => {
  await message.removePP(message.user);
  return await message.reply("_Profile Picture Removed_");
 }
);

command(
 {
  pattern: "setname",
  fromMe: true,
  desc: "Set User name",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.reply("_Enter name_");
  await message.updateName(match);
  return await message.reply(`_Username Updated : ${match}_`);
 }
);

command(
 {
  pattern: "block",
  fromMe: true,
  desc: "Block a person",
  type: "whatsapp",
 },
 async (message, match) => {
  if (message.isGroup) {
   let jid = message.mention[0] || message.reply_message.jid;
   if (!jid) return await message.reply("_Reply to a person or mention_");
   await message.block(jid);
   return await message.sendMessage(`_@${jid.split("@")[0]} Blocked_`, {
    mentions: [jid],
   });
  } else {
   await message.reply("_Blocked_");
   return await message.block(message.jid);
  }
 }
);

command(
 {
  pattern: "unblock",
  fromMe: true,
  desc: "Unblock a person",
  type: "whatsapp",
 },
 async (message, match) => {
  if (message.isGroup) {
   let jid = message.mention[0] || message.reply_message.jid;
   if (!jid) return await message.reply("_Reply to a person or mention_");
   await message.block(jid);
   return await message.sendMessage(message.jid, `_@${jid.split("@")[0]} unblocked_`, {
    mentions: [jid],
   });
  } else {
   await message.unblock(message.jid);
   return await message.reply("_User unblocked_");
  }
 }
);

command(
 {
  pattern: "jid",
  fromMe: true,
  desc: "Give jid of chat/user",
  type: "whatsapp",
 },
 async (message, match) => {
  return await message.sendMessage(message.jid, message.mention[0] || message.reply_message.jid || message.jid);
 }
);

command(
 {
  pattern: "dlt",
  fromMe: true,
  desc: "deletes a message",
  type: "whatsapp",
 },
 async (message, match, m, client) => {
  if (message.isGroup) {
   client.sendMessage(message.jid, { delete: message.reply_message.key });
  }
 }
);
command(
 {
  on: "delete",
  fromMe: false,
  desc: "Logs the recent deleted message",
 },
 async (message, match) => {
  if (!DELETED_LOG) return;
  if (!DELETED_LOG_CHAT) return await message.sendMessage(message.user, "Please set DELETED_LOG_CHAT in ENV to use log delete message");
  let msg = await loadMessage(message.messageId);
  if (!msg) return;
  msg = await serialize(JSON.parse(JSON.stringify(msg.message)), message.client);
  if (!msg) return await message.reply("No deleted message found");
  let deleted = await message.forward(DELETED_LOG_CHAT, msg.message);
  var name;
  if (!msg.from.endsWith("@g.us")) {
   let getname = await getName(msg.from);
   name = `_Name : ${getname}_`;
  } else {
   let gname = (await message.client.groupMetadata(msg.from)).subject;
   let getname = await getName(msg.sender);
   name = `_Group : ${gname}_\n_Name : ${getname}_`;
  }
  return await message.sendMessage(DELETED_LOG_CHAT, `_Message Deleted_\n_From : ${msg.from}_\n${name}\n_SenderJid : ${msg.sender}_`, { quoted: deleted });
 }
);

const numToJid = num => num + "@s.whatsapp.net";

command(
 {
  pattern: "forward",
  fromMe: true,
  desc: "Forwards the replied Message",
  type: "whatsapp",
 },
 async (message, match, m) => {
  if (!m.quoted) return message.reply("Reply to something");
  let jids = parsedJid(match);
  for (let i of jids) {
   await message.forward(i, message.reply_message.message);
  }
 }
);

command(
 {
  pattern: "quoted",
  fromMe: true,
  desc: "quoted message",
  type: "whatsapp",
 },
 async message => {
  if (!message.reply_message) return await message.reply("*Reply to a message*");
  let key = message.reply_message.key;
  let msg = await loadMessage(key.id);
  if (!msg) return await message.reply("_Message not found maybe bot might not be running at that time_");
  msg = await serialize(JSON.parse(JSON.stringify(msg.message)), message.client);
  if (!msg.quoted) return await message.reply("No quoted message found");
  await message.forward(message.jid, msg.quoted.message);
 }
);
