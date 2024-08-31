const { decodeJid, createInteractiveMessage, parsedJid } = require("../functions");
const Base = require("./Base");
const { writeExifWebp } = require("../exif");
const config = require("../../config");
const ReplyMessage = require("./ReplyMessage");
const fileType = require("file-type");
const { generateWAMessageFromContent, generateWAMessage } = require("baileys");

class AllMessage extends Base {
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
  this.fromMe = data.key.fromMe;
  this.isBaileys = this.id.startsWith("BAE5");
  this.timestamp = data.messageTimestamp?.low || data.messageTimestamp;

  if (data.type) {
   const type = data.type.replace("Message", "").toLowerCase();
   this[type] = data.message[data.type];
   const contextInfo = this[type]?.contextInfo;
   this.mention = contextInfo?.mentionedJid || [];

   if (data.quoted && !data.message.buttonsResponseMessage) {
    this.reply_message = new ReplyMessage(this.client, contextInfo, data);
    const quotedMessage = data.quoted.message.extendedTextMessage;
    this.reply_message.type = data.quoted.type || "extendedTextMessage";
    this.reply_message.mtype = data.quoted.mtype;
    this.reply_message.mimetype = quotedMessage?.text?.mimetype || "text/plain";
    this.reply_message.key = data.quoted.key;
    this.reply_message.message = data.quoted.message;
    this.reply_message.mention = quotedMessage?.contextInfo?.mentionedJid || [];
   } else {
    this.reply_message = null;
   }
  } else {
   this.type = "baileysEmit";
  }

  return super._patch(data);
 }

 async sendMessage(jid, content, options = {}, type = "text") {
  const recipient = jid.endsWith("@s.whatsapp.net") ? jid : this.jid;
  const defaultOptions = { packname: "Xasena", author: "X-electra" };
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
    const mediaType = type.toLowerCase();
    if (Buffer.isBuffer(content)) {
     return this.client.sendMessage(recipient, {
      [mediaType]: content,
      ...mergedOptions,
     });
    } else if (isUrl(content)) {
     return this.client.sendMessage(recipient, {
      [mediaType]: { url: content },
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

 async sendReply(text, opt = {}) {
  if (!this.jid) {
   throw new Error("No recipient JID available. Make sure this.jid is set.");
  }

  const options = {
   quoted: this,
   ...opt,
  };

  return this.client.sendMessage(this.jid, { text }, options);
 }

 async log() {
  console.log(this.data);
 }

 async sendFile(content, options = {}) {
  const { data } = await this.client.getFile(content);
  const type = (await fileType.fromBuffer(data)) || {};
  return this.client.sendMessage(this.jid, { [type.mime.split("/")[0]]: data }, options);
 }

 async edit(text, opt = {}) {
  await this.client.sendMessage(this.jid, { text, edit: this.key, ...opt });
 }

 async reply(text, options = {}) {
  return this.client.sendMessage(this.jid, { text, ...options }, { ...options, quoted: this });
 }

 async send(jid, text, options = {}) {
  const recipient = jid.endsWith("@s.whatsapp.net") ? jid : this.jid;
  return this.client.sendMessage(recipient, { text, ...options });
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
}

module.exports = AllMessage;
