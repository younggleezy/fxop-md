const { decodeJid, createInteractiveMessage, parsedJid, isUrl, getContentType } = require("../functions");
const Base = require("./Base");
const { writeExifWebp } = require("../exif");
const config = require("../../config");
const ReplyMessage = require("./ReplyMessage");
const fileType = require("file-type");
const { generateWAMessageFromContent, generateForwardMessageContent, generateWAMessage } = require("baileys");

class Message extends Base {
 constructor(client, data) {
  super(client);
  if (data) this._patch(data);
 }

 _patch(data) {
  this.user = decodeJid(this.client.user.id);
  this.key = data.key;
  this.isGroup = data.isGroup;
  this.prefix = data.prefix;
  this.id = data.key.id;
  this.jid = data.key.remoteJid;
  this.message = { key: data.key, message: data.message };
  this.pushName = data.pushName;
  this.participant = parsedJid(data.sender)[0];
  this.sudo = (config.SUDO?.split(",") || []).includes(this.participant?.split("@")[0]);
  this.text = data.body;
  this.fromMe = data.key.fromMe;
  this.isBaileys = this.id.startsWith("BAE5");
  this.timestamp = data.messageTimestamp.low || data.messageTimestamp;
  const contextInfo = data.message.extendedTextMessage?.contextInfo;
  this.mention = contextInfo?.mentionedJid || [];

  if (data.quoted && !data.message.buttonsResponseMessage) {
   this.reply_message = new ReplyMessage(this.client, contextInfo, data);
   const quotedMessage = data.quoted.message.extendedTextMessage;
   this.reply_message.type = data.quoted.type || "extendedTextMessage";
   this.reply_message.mtype = data.quoted.mtype;
   this.reply_message.key = data.quoted.key;
   this.reply_message.mention = quotedMessage?.contextInfo?.mentionedJid || [];
  } else {
   this.reply_message = null;
  }

  return super._patch(data);
 }

 async sendReply(text, options = {}) {
  return this.client.sendMessage(this.jid, { text }, { ...options, quoted: this });
 }

 async log() {
  console.log(this.data);
 }

 async sendFile(content, options = {}) {
  const { data } = await this.client.getFile(content);
  const type = (await fileType.fromBuffer(data)) || {};
  return this.client.sendMessage(this.jid, { [type.mime.split("/")[0]]: data }, options);
 }

 async edit(text, options = {}) {
  await this.client.sendMessage(this.jid, {
   text,
   edit: this.key,
   ...options,
  });
 }

 async reply(text, options = {}) {
  return this.client.sendMessage(this.jid, { text, ...options }, { ...options, quoted: this });
 }

 async send(jid, text, options = {}) {
  const recipient = jid.endsWith("@s.whatsapp.net") ? jid : this.jid;
  return this.client.sendMessage(recipient, { text, ...options });
 }

 async sendMessage(jid, content, options = {}, type = "text") {
  const recipient = jid || this.jid;
  const defaultOptions = {
   packname: "Xasena",
   author: "X-electra",
   fileName: "FX-BOT",
  };
  const mergedOptions = { ...defaultOptions, ...options };

  switch (type.toLowerCase()) {
   case "text":
    return this.client.sendMessage(recipient, {
     text: content,
     ...mergedOptions,
    });
   case "image":
   case "photo":
   case "video":
   case "audio":
   case "document":
    if (Buffer.isBuffer(content)) {
     return this.client.sendMessage(recipient, {
      [type]: content,
      ...mergedOptions,
     });
    } else if (isUrl(content)) {
     return this.client.sendMessage(recipient, {
      [type]: { url: content },
      ...mergedOptions,
     });
    }
    break;
   case "template":
    const optional = await generateWAMessage(recipient, content, mergedOptions);
    const message = {
     viewOnceMessage: {
      message: {
       ...optional.message,
      },
     },
    };
    await this.client.relayMessage(recipient, message, {
     messageId: optional.key.id,
    });
    break;
   case "interactive":
    const genMessage = createInteractiveMessage(content);
    await this.client.relayMessage(recipient, genMessage.message, {
     messageId: genMessage.key.id,
    });
    break;
   case "sticker":
    const { data, mime } = await this.client.getFile(content);
    if (mime === "image/webp") {
     const buff = await writeExifWebp(data, mergedOptions);
     await this.client.sendMessage(recipient, { sticker: { url: buff }, ...mergedOptions }, mergedOptions);
    } else {
     const mimePrefix = mime.split("/")[0];
     if (mimePrefix === "video" || mimePrefix === "image") {
      await this.client.sendImageAsSticker(recipient, content, mergedOptions);
     }
    }
    break;
   default:
    throw new Error(`Unsupported message type: ${type}`);
  }
 }

 async forward(jid, content, options = {}) {
  if (options.readViewOnce) {
   content = content?.ephemeralMessage?.message || content;
   const viewOnceKey = Object.keys(content)[0];
   delete content?.ignore;
   delete content?.viewOnceMessage?.message?.[viewOnceKey]?.viewOnce;
   content = { ...content?.viewOnceMessage?.message };
  }

  if (options.mentions) {
   content[getContentType(content)].contextInfo.mentionedJid = options.mentions;
  }

  const forwardContent = generateForwardMessageContent(content, false);
  const contentType = getContentType(forwardContent);

  const forwardOptions = {
   ptt: options.ptt,
   waveform: options.audiowave,
   seconds: options.seconds,
   fileLength: options.fileLength,
   caption: options.caption,
   contextInfo: options.contextInfo,
  };

  if (options.mentions) {
   forwardOptions.contextInfo.mentionedJid = options.mentions;
  }

  if (contentType !== "conversation") {
   forwardOptions.contextInfo = content?.message[contentType]?.contextInfo || {};
  }

  forwardContent[contentType].contextInfo = {
   ...forwardOptions.contextInfo,
   ...forwardContent[contentType]?.contextInfo,
  };

  const waMessage = generateWAMessageFromContent(jid, forwardContent, {
   ...forwardContent[contentType],
   ...forwardOptions,
  });
  return await this.client.relayMessage(jid, waMessage.message, {
   messageId: waMessage.key.id,
  });
 }

 async updatePresence(status) {
  await this.client.sendPresenceUpdate(status, this.jid);
 }

 async delete(key) {
  await this.client.sendMessage(this.jid, { delete: key });
 }

 async updateName(name) {
  await this.client.updateProfileName(name);
 }

 async getPP(jid) {
  return await this.client.profilePictureUrl(jid, "image");
 }

 async setPP(jid, pp) {
  const profilePicture = Buffer.isBuffer(pp) ? pp : { url: pp };
  await this.client.updateProfilePicture(jid, profilePicture);
 }

 async updateBlockStatus(jid, action) {
  await this.client.updateBlockStatus(jid, action);
 }

 async block(jid) {
  await this.updateBlockStatus(jid, "block");
 }

 async unblock(jid) {
  await this.updateBlockStatus(jid, "unblock");
 }

 async groupParticipantsUpdate(jid, action) {
  return await this.client.groupParticipantsUpdate(this.jid, jid, action);
 }

 async add(jid) {
  return this.groupParticipantsUpdate(jid, "add");
 }

 async kick(jid) {
  return this.groupParticipantsUpdate(jid, "remove");
 }

 async promote(jid) {
  return this.groupParticipantsUpdate(jid, "promote");
 }

 async demote(jid) {
  return this.groupParticipantsUpdate(jid, "demote");
 }
}

module.exports = Message;
