const fs = require("fs");
const axios = require("axios");
const config = require("../config");
const { command, qrcode, mode, readQr, removeBg } = require("../lib/");
const { buffThumb } = require("../media");
const { PluginDB, installPlugin } = require("../lib/database").Plugins;

command(
 {
  pattern: "install",
  fromMe: true,
  desc: "Installs External plugins",
  type: "misc",
 },
 async (message, match) => {
  if (!match) return await message.sendMessage(message.jid, "_Send a plugin url_");

  try {
   var url = new URL(match);
  } catch (e) {
   console.log(e);
   return await message.sendMessage(message.jid, "_Invalid Url_");
  }

  if (url.host === "gist.github.com") {
   url.host = "gist.githubusercontent.com";
   url = url.toString() + "/raw";
  } else {
   url = url.toString();
  }

  var plugin_name;
  try {
   const { data, status } = await axios.get(url);
   if (status === 200) {
    var comand = data.match(/(?<=pattern:) ["'](.*?)["']/);
    plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
    if (!plugin_name) {
     plugin_name = "__" + Math.random().toString(36).substring(8);
    }
    fs.writeFileSync(__dirname + "/" + plugin_name + ".js", data);
    try {
     require("./" + plugin_name);
    } catch (e) {
     fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
     return await message.sendMessage(message.jid, "Invalid Plugin\n ```" + e + "```");
    }

    await installPlugin(url, plugin_name);

    await message.sendMessage(message.jid, `_New plugin installed : ${plugin_name}_`);
   }
  } catch (error) {
   console.error(error);
   return await message.sendMessage(message.jid, "Failed to fetch plugin");
  }
 }
);

command({ pattern: "plugin", fromMe: true, desc: "plugin list", type: "misc" }, async (message, match) => {
 var mesaj = "";
 var plugins = await PluginDB.findAll();
 if (plugins.length < 1) {
  return await message.sendMessage(message.jid, "_No external plugins installed_");
 } else {
  plugins.map(plugin => {
   mesaj += "```" + plugin.dataValues.name + "```: " + plugin.dataValues.url + "\n";
  });
  return await message.sendMessage(message.jid, mesaj);
 }
});

command(
 {
  pattern: "remove",
  fromMe: true,
  desc: "Remove external plugins",
  type: "misc",
 },
 async (message, match) => {
  if (!match) return await message.sendMessage(message.jid, "_Need a plugin name_");

  var plugin = await PluginDB.findAll({ where: { name: match } });

  if (plugin.length < 1) {
   return await message.sendMessage(message.jid, "_Plugin not found_");
  } else {
   await plugin[0].destroy();
   delete require.cache[require.resolve("./" + match + ".js")];
   fs.unlinkSync(__dirname + "/" + match + ".js");
   await message.sendMessage(message.jid, `Plugin ${match} deleted`);
  }
 }
);

command(
 {
  pattern: "qr",
  fromMe: mode,
  desc: "Read/Write Qr.",
  type: "misc",
 },
 async (message, match, m) => {
  match = match || message.reply_message.text;

  if (match) {
   let buff = await qrcode(match);
   return await message.sendMessage(message.jid, buff, {}, "image");
  } else if (message.reply_message.image) {
   const buffer = await m.quoted.download();
   readQr(buffer)
    .then(async data => {
     return await message.sendMessage(message.jid, data);
    })
    .catch(async error => {
     console.error("Error:", error.message);
     return await message.sendMessage(message.jid, error.message);
    });
  } else {
   return await message.sendMessage(message.jid, "*Example : qr test*\n*Reply to a qr image.*");
  }
 }
);

command(
 {
  pattern: "rmbg",
  fromMe: mode,
  desc: "Remove background of an image",
  type: "misc",
 },
 async (message, m) => {
  if (!config.REMOVEBG) return await message.sendMessage(message.jid, "Set RemoveBg API Key in config.js \n Get it from https://www.remove.bg/api");
  if (!message.reply_message && !message.reply_message.image) return await message.reply("Reply to an image");
  let buff = await m.quoted.download();
  let buffer = await removeBg(buff);
  if (!buffer) return await message.reply("An error occured");
  await message.sendMessage(
   message.jid,
   buffer,
   {
    quoted: message.reply_message.key,
    mimetype: "image/png",
    fileName: "removebg.png",
   },
   "document"
  );
 }
);

command(
 {
  pattern: "ping",
  fromMe: mode,
  desc: "To check ping",
  type: "misc",
 },
 async message => {
  const start = new Date().getTime();
  const sentMessage = await message.reply("```Ping!```");
  const end = new Date().getTime();
  const responseTime = end - start;
  await new Promise(resolve => setTimeout(resolve, 100));
  await message.edit(`*Pong!*\n \`\`\`${responseTime}\`\`\` *ms*`);
 }
);

command(
 {
  pattern: "alive",
  desc: "Shows system status with different designs.",
  type: "misc",
 },
 async message => {
  const aliveMessage = `
    ғxᴏᴘ ʙᴏᴛ ɪs ᴏɴʟɪɴᴇ ᴀɴᴅ ᴀᴄᴛɪᴠᴇ
    `;
    const thumbnailPath = '../media/images/thumb.jpg'
    const thumbnail = await buffThumb(thumbnailPath)
  try {
   await message.send(thumbnail, {
    caption: aliveMessage,
   });
  } catch (error) {
   console.error("Error sending alive message:", error);
   await message.reply("An error occurred while sending the alive message. Please try again later.");
  }
 }
);
