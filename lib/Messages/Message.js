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
  if (!this.key) {
   throw new Error("No message key available for editing");
  }

  try {
   await this.client.relayMessage(
    this.jid,
    {
     protocolMessage: {
      key: this.key,
      type: 14,
      editedMessage: {
       conversation: text,
      },
     },
    },
    {}
   );
  } catch (error) {
   console.error("Error editing message:", error);
   throw error;
  }
 }

 async reply(text, options = {}) {
  return this.client.sendMessage(this.jid, { text, ...options }, { ...options, quoted: this });
 }

 async send(content, options = {}, type = "text", jid = null) {
  const recipient = jid || this.jid || this.chat?.jid;
  if (!recipient) {
   throw new Error("No recipient JID provided or available");
  }

  const formattedJid = recipient.endsWith("@s.whatsapp.net") ? recipient : `${recipient}@s.whatsapp.net`;

  const defaultOptions = {
   packname: "FX-BOT",
   author: "Astro",
   fileName: "fxop-md",
  };
  const mergedOptions = { ...defaultOptions, ...options };

  const safeStringify = (data) => {
   if (typeof data === "string") return data;
   try {
    return JSON.stringify(data);
   } catch (error) {
    console.error("Error stringifying content:", error);
    return String(data);
   }
  };

  try {
   switch (type.toLowerCase()) {
    case "text":
     return await this.client.sendMessage(formattedJid, {
      text: safeStringify(content),
      ...mergedOptions,
     });

    case "image":
    case "video":
    case "audio":
    case "document":
     if (Buffer.isBuffer(content) || (typeof content === "string" && this.isUrl(content))) {
      return await this.client.sendMessage(formattedJid, {
       [type]: Buffer.isBuffer(content) ? content : { url: content },
       ...mergedOptions,
      });
     } else {
      throw new Error(`Invalid content for ${type} message`);
     }

    case "sticker":
     if (Buffer.isBuffer(content) || (typeof content === "string" && this.isUrl(content))) {
      const stickerBuffer = await this.convertToSticker(content);
      return await this.client.sendMessage(formattedJid, {
       sticker: stickerBuffer,
       ...mergedOptions,
      });
     } else {
      throw new Error("Invalid content for sticker message");
     }

    case "location":
     if (typeof content === "object" && "latitude" in content && "longitude" in content) {
      return await this.client.sendMessage(formattedJid, {
       location: content,
       ...mergedOptions,
      });
     } else {
      throw new Error("Invalid content for location message");
     }

    case "contact":
     if (typeof content === "object" && "name" in content && "number" in content) {
      return await this.client.sendMessage(formattedJid, {
       contacts: {
        displayName: content.name,
        contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${content.name}\nTEL;type=CELL;type=VOICE;waid=${content.number}:${content.number}\nEND:VCARD` }],
       },
       ...mergedOptions,
      });
     } else {
      throw new Error("Invalid content for contact message");
     }

    case "button":
     if (Array.isArray(content) && content.length > 0) {
      const buttons = content.map((button) => ({
       buttonId: button.id || `btn_${Math.random().toString(36).substr(2, 9)}`,
       buttonText: { displayText: button.text },
       type: 1,
      }));
      return await this.client.sendMessage(formattedJid, {
       buttons: buttons,
       headerType: 1,
       text: mergedOptions.text || "Please select an option:",
       ...mergedOptions,
      });
     } else {
      throw new Error("Invalid content for button message");
     }

    case "template":
     const templateMessage = await this.generateTemplateMessage(content, mergedOptions);
     return await this.client.sendMessage(formattedJid, templateMessage);

    case "list":
     if (typeof content === "object" && "title" in content && "items" in content) {
      return await this.client.sendMessage(formattedJid, {
       listMessage: {
        title: content.title,
        buttonText: content.buttonText || "Select an option",
        sections: content.items,
       },
       ...mergedOptions,
      });
     } else {
      throw new Error("Invalid content for list message");
     }

    default:
     throw new Error(`Unsupported message type: ${type}`);
   }
  } catch (error) {
   console.error(`Error in send (${type}):`, error);
   throw error;
  }
 }

 async sendMessage(content, options = {}, type = "text", jid = null) {
  const recipient = jid || this.jid || this.chat?.jid;
  if (!recipient) {
   throw new Error("No recipient JID provided or available");
  }

  const defaultOptions = {
   packname: "FX-BOT",
   author: "Astro",
   fileName: "FX-BOT",
  };
  const mergedOptions = { ...defaultOptions, ...options };

  // Helper function to safely stringify content
  const safeStringify = (data) => {
   if (typeof data === "string") return data;
   try {
    return JSON.stringify(data);
   } catch (error) {
    console.error("Error stringifying content:", error);
    return String(data);
   }
  };

  try {
   switch (type.toLowerCase()) {
    case "text":
     return await this.client.sendMessage(recipient, {
      text: safeStringify(content),
      ...mergedOptions,
     });
    case "image":
    case "photo":
    case "video":
    case "audio":
    case "document":
     if (Buffer.isBuffer(content)) {
      return await this.client.sendMessage(recipient, {
       [type]: content,
       ...mergedOptions,
      });
     } else if (typeof content === "string" && isUrl(content)) {
      return await this.client.sendMessage(recipient, {
       [type]: { url: content },
       ...mergedOptions,
      });
     } else {
      throw new Error(`Invalid content for ${type} message`);
     }
    case "template":
     const optional = await generateWAMessage(recipient, safeStringify(content), mergedOptions);
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
      } else {
       throw new Error(`Unsupported mime type for sticker: ${mime}`);
      }
     }
     break;
    default:
     throw new Error(`Unsupported message type: ${type}`);
   }
  } catch (error) {
   console.error(`Error in sendMessage (${type}):`, error);
   throw error; // Re-throw the error for the caller to handle
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
