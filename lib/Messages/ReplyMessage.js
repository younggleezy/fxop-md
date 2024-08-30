const { decodeJid } = require("..");
const config = require("../../config");
const { parsedJid } = require("../functions");
const Base = require("./Base");
const fileType = require("file-type");
const { tmpdir } = require("os");
const fs = require("fs").promises;
const path = require("path");

class ReplyMessage extends Base {
 constructor(client, data) {
  super(client);
  if (data) this._patch(data);
 }

 _patch(data) {
  this.key = data.key;
  this.id = data.stanzaId;
  this.isBaileys = this.id.startsWith("BAE5") || this.id.length === 16;
  this.jid = data.participant;
  this.sudo = (config.SUDO?.split(",") || []).includes(this.jid?.split("@")[0]);
  this.fromMe = parsedJid(this.client.user.jid)[0] === parsedJid(this.jid)[0];

  const { quotedMessage } = data;
  if (quotedMessage) {
   this._parseQuotedMessage(quotedMessage);
  }

  return super._patch(data);
 }

 _parseQuotedMessage(quotedMessage) {
  const type = Object.keys(quotedMessage)[0];

  switch (type) {
   case "extendedTextMessage":
   case "conversation":
    this.text = quotedMessage[type].text || quotedMessage[type];
    this.mimetype = "text/plain";
    break;
   case "stickerMessage":
    this.mimetype = "image/webp";
    this.sticker = quotedMessage[type];
    break;
   default:
    this._parseOtherMessageTypes(type, quotedMessage[type]);
  }
 }

 _parseOtherMessageTypes(type, message) {
  const mimetype = message?.mimetype || type;

  if (mimetype.includes("/")) {
   this.mimetype = mimetype;
   const [mimeCategory] = mimetype.split("/");
   this[mimeCategory] = message;
  } else {
   this.mimetype = mimetype;
   this.message = message;
  }
 }

 async downloadMediaMessage() {
  try {
   const buff = await this.m.quoted.download();
   const type = await fileType.fromBuffer(buff);
   const filePath = path.join(tmpdir(), `download_${Date.now()}${type.ext}`);
   await fs.writeFile(filePath, buff);
   return filePath;
  } catch (error) {
   console.error("Error downloading media message:", error);
   throw error;
  }
 }
}

module.exports = ReplyMessage;
