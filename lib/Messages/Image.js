const config = require("../../config");
const Base = require("./Base");
const { writeExifWebp } = require("../exif");
const { generateWAMessageFromContent, generateWAMessage } = require("baileys");
const fileType = require("file-type");
const { getBuffer, isUrl } = require("../functions");
const Message = require("./Message");

class Image extends Base {
 constructor(client, data) {
  super(client);
  if (data) this._patch(data);
 }

 _patch(data) {
  this.isGroup = data.isGroup;
  this.id = data.key.id;
  this.jid = data.key.remoteJid;
  this.isBaileys = this.id.startsWith("BAE5");
  this.pushName = data.pushName;
  this.participant = data.sender;
  this.sudo = (config.SUDO?.split(",") || []).includes(this.participant?.split("@")[0]);
  this.caption = data.body;
  this.fromMe = data.key.fromMe;
  this.timestamp = typeof data.messageTimestamp === "object" ? data.messageTimestamp.low : data.messageTimestamp;
  this.key = data.key;
  this.message = data.message.imageMessage;
  this.reply_message = data.quoted || null;

  return super._patch(data);
 }

 async sendFile(content, options = {}) {
  const { data } = await this.client.getFile(content);
  const type = await fileType.fromBuffer(data);
  return this.client.sendMessage(this.jid, { [type.mime.split("/")[0]]: data, ...options }, options);
 }

 async reply(text, options) {
  const message = await this.client.sendMessage(this.jid, { text }, { quoted: this.data, ...options });
  return new Message(this.client, message);
 }

 async send(jid, text, options = {}) {
  return this.sendMessage(jid, text, options);
 }

 async sendMessage(jid, content, options = {}) {
  const recipient = jid || this.jid;
  const defaultOptions = { packname: "Xasena", author: "X-electra" };
  const mergedOptions = { ...defaultOptions, ...options };

  if (typeof content === "string") {
   return this.client.sendMessage(recipient, { text: content, ...mergedOptions }, mergedOptions);
  }

  const { type, data } = content;
  switch (type.toLowerCase()) {
   case "image":
   case "video":
   case "audio":
    if (Buffer.isBuffer(data)) {
     return this.client.sendMessage(recipient, { [type]: data, ...mergedOptions }, mergedOptions);
    } else if (isUrl(data)) {
     return this.client.sendMessage(recipient, { [type]: { url: data }, ...mergedOptions }, mergedOptions);
    }
    break;
   case "template":
    const optional = await generateWAMessage(recipient, data, mergedOptions);
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
   case "sticker":
    const { mime } = await this.client.getFile(data);
    if (mime === "image/webp") {
     const buff = await writeExifWebp(data, mergedOptions);
     await this.client.sendMessage(recipient, { sticker: { url: buff }, ...mergedOptions }, mergedOptions);
    } else {
     const mimeType = mime.split("/")[0];
     if (mimeType === "video" || mimeType === "image") {
      await this.client.sendImageAsSticker(recipient, data, mergedOptions);
     }
    }
    break;
   default:
    throw new Error(`Unsupported message type: ${type}`);
  }
 }

 async forward(jid, message, options = {}) {
  const m = generateWAMessageFromContent(jid, message, {
   ...options,
   userJid: this.client.user.id,
  });
  await this.client.relayMessage(jid, m.message, {
   messageId: m.key.id,
   ...options,
  });
  return m;
 }

 async sendFromUrl(url, options = {}) {
  const buff = await getBuffer(url);
  const mime = await fileType.fromBuffer(buff);
  const type = mime.mime.split("/")[0];
  const sendOptions = type === "audio" ? { ...options, mimetype: "audio/mpeg" } : options;
  return this.client.sendMessage(this.jid, { [type === "application" ? "document" : type]: buff, ...sendOptions }, sendOptions);
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
  if (Buffer.isBuffer(pp)) {
   await this.client.updateProfilePicture(jid, pp);
  } else {
   await this.client.updateProfilePicture(jid, { url: pp });
  }
 }

 async block(jid) {
  await this.client.updateBlockStatus(jid, "block");
 }

 async unblock(jid) {
  await this.client.updateBlockStatus(jid, "unblock");
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

module.exports = Image;
