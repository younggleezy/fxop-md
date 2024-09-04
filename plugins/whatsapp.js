const { command, mode, serialize, parsedJid } = require("../lib/");
const { DELETED_LOG_CHAT, DELETED_LOG, STATUS_SAVER } = require("../config");
const { loadMessage, getName } = require("../lib/database/StoreDb");

command(
 {
  pattern: "vv",
  fromMe: mode,
  desc: "Forwards The View once messsage",
  type: "whatsapp",
 },
 async (message, match, m) => {
  if (!message.reply_message) return await message.reply("Reply a ViewOnce");
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
  if (message.isGroup) return;
  const triggerKeywords = ["save", "send", "sent", "snt", "give", "snd"];
  const cmdz = match.toLowerCase().split(" ")[0];
  if (triggerKeywords.some(tr => cmdz.includes(tr))) {
   const relayOptions = { messageId: m.quoted.key.id };
   return await message.client.relayMessage(message.jid, m.quoted.message, relayOptions);
  }
 }
);
command(
 {
  pattern: "setpp",
  fromMe: mode,
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
  fromMe: mode,
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
  fromMe: mode,
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
  fromMe: mode,
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
  fromMe: mode,
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
  fromMe: mode,
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
  fromMe: mode,
  desc: "deletes a message",
  type: "whatsapp",
 },
 async (message, match, m, client) => {
  if (message.reply_message) {
   await client.sendMessage(message.jid, { delete: message.reply_message.key });
  } else {
   await message.reply("Please reply to a message to delete it.");
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

command(
 {
  pattern: "setbio",
  fromMe: true,
  desc: "To change your profile status",
  type: "whatsapp",
 },
 async (message, match) => {
  match = match || message.reply_message.text;
  if (!match) return await message.send("*Need Status!*\n*Example: setbio Hey there! I am using WhatsApp*.");
  await message.client.updateProfileStatus(match);
  await message.reply("_Profile bio updated_");
 }
);

command(
 {
  pattern: "forward",
  fromMe: true,
  desc: "Forwards the replied message",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!message.quoted) return await message.reply("Reply to message");
  if (!match) return await message.reply("*Provide a JID; use 'jid' command to get JID*");
  let jids = parsedJid(match);
  for (let jid of jids) {
   await message.client.forwardMessage(jid, message.reply_message.message);
  }
  await message.reply("_Message forwarded_");
 }
);

command(
 {
  pattern: "caption ?(.*)",
  fromMe: true,
  desc: "Change video or image caption",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!message.reply_message.video && !message.reply_message.image && !message.image && !message.video) return await message.reply("*_Reply to an image or video_*");
  if (!match) return await message.reply("*Need a query, e.g., .caption Hello*");
  await message.client.forwardMessage(message.jid, message.quoted ? message.reply_message.message : message.message, { caption: match });
 }
);

command(
 {
  pattern: "getprivacy ?(.*)",
  fromMe: true,
  desc: "get your privacy settings",
  type: "whatsapp",
 },
 async (message, match) => {
  const { readreceipts, profile, status, online, last, groupadd, calladd } = await message.client.fetchPrivacySettings(true);
  const msg = `*♺ my privacy*\n\n*ᝄ name :* ${message.client.user.name}\n*ᝄ online:* ${online}\n*ᝄ profile :* ${profile}\n*ᝄ last seen :* ${last}\n*ᝄ read receipt :* ${readreceipts}\n*ᝄ about seted time :*\n*ᝄ group add settings :* ${groupadd}\n*ᝄ call add settings :* ${calladd}`;
  let img = await message.client.profilePictureUrl(message.user.jid, "image").catch(() => "https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg");
  await message.send(img, { caption: msg }, "image");
 }
);

command(
 {
  pattern: "lastseen ?(.*)",
  fromMe: true,
  desc: "to change lastseen privacy",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change last seen privacy settings_`);
  const available_privacy = ["all", "contacts", "contact_blacklist", "none"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateLastSeenPrivacy(match);
  await message.send(`_Privacy settings *last seen* Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "online ?(.*)",
  fromMe: true,
  desc: "to change online privacy",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change *online*  privacy settings_`);
  const available_privacy = ["all", "match_last_seen"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateOnlinePrivacy(match);
  await message.send(`_Privacy Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "mypp ?(.*)",
  fromMe: true,
  desc: "privacy setting profile picture",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change *profile picture*  privacy settings_`);
  const available_privacy = ["all", "contacts", "contact_blacklist", "none"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateProfilePicturePrivacy(match);
  await message.send(`_Privacy Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "mystatus ?(.*)",
  fromMe: true,
  desc: "privacy for my status",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change *status*  privacy settings_`);
  const available_privacy = ["all", "contacts", "contact_blacklist", "none"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateStatusPrivacy(match);
  await message.send(`_Privacy Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "read ?(.*)",
  fromMe: true,
  desc: "privacy for read message",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change *read and receipts message*  privacy settings_`);
  const available_privacy = ["all", "none"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateReadReceiptsPrivacy(match);
  await message.send(`_Privacy Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "groupadd ?(.*)",
  fromMe: true,
  desc: "privacy for group add",
  type: "whatsapp",
 },
 async (message, match) => {
  if (!match) return await message.send(`_*Example:-* ${message.prefix} all_\n_to change *group add*  privacy settings_`);
  const available_privacy = ["all", "contacts", "contact_blacklist", "none"];
  if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join("/")}* values_`);
  await message.client.updateGroupsAddPrivacy(match);
  await message.send(`_Privacy Updated to *${match}*_`);
 }
);

command(
 {
  pattern: "quoted",
  fromMe: mode,
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
