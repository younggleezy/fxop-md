const fs = require("fs");
const axios = require("axios");
const config = require("../config");
const { command, qrcode, mode, readQr, removeBg, shortenUrl } = require("../lib/");
const { buffpath } = require("../media");
const { PluginDB, installPlugin } = require("../lib/database").Plugins;

command(
   {
      pattern: "repo",
      fromMe: mode,
      desc: "Repo",
      type: "misc",
   },
   async (message, match, client) => {
      let { data } = await axios.get("https://api.github.com/repos/FXastro/fxop-md");
      let mssg = `
\`\`\`FXOP-MD Repo Stat\`\`\`\n
╭══════════❐
┃ *Owner*: _*FXastro*_
┃ *Repo*: _https://github.com/FXastro/fxop-md_
┃ *Stars*: _${data.stargazers_count}_
┃ *Forks*: _${data.forks}_
┃ *Code*: _${data.language}_
╰══════════❐
    `;
      mssg += `\n> Stars: ${data.stargazers_count}\n> Forks: ${data.forks}`;
      const thumbnailPath = "../media/images/thumb.jpg";
      const thumbnail = await buffpath(thumbnailPath);
      return await message.send(thumbnail, {
         caption: mssg,
         contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
               newsletterJid: "120363327841612745@newsletter",
               newsletterName: "ғx-ʀᴇᴘᴏɪsᴛᴏʀʏ",
            },
         },
      });
   }
);

command(
   {
      pattern: "install",
      fromMe: mode,
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

command({ pattern: "plugin", fromMe: mode, desc: "plugin list", type: "misc" }, async (message, match) => {
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
      fromMe: mode,
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
      if (!config.REMOVEBG) return await message.send("Set RemoveBg API Key in config.js \n Get it from https://www.remove.bg/api");
      if (!message.reply_message && !message.reply_message.image) return await message.reply("Reply to an image");
      let buff = await m.quoted.download();
      let buffer = await removeBg(buff);
      if (!buffer) return await message.reply("An error occured");
      await message.sendFile(buffer);
   }
);

command(
   {
      pattern: "ping ?(.*)",
      fromMe: mode,
      desc: "Bot response in milliseconds.",
      type: "system",
   },
   async message => {
      const start = new Date().getTime();
      const msg = await message.reply("*ᴩɪɴɢ...*");
      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;
      await msg.edit(`*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ ${responseTime} secs*`);
   }
);

command(
   {
      pattern: "alive",
      fromMe: mode,
      desc: "Shows system status with different designs.",
      type: "misc",
   },
   async message => {
      const aliveMessage = `
    ғxᴏᴘ ʙᴏᴛ ɪs ᴏɴʟɪɴᴇ ᴀɴᴅ ᴀᴄᴛɪᴠᴇ
    `;
      const thumbnailPath = "../media/images/thumb.jpg";
      const thumbnail = await buffpath(thumbnailPath);
      try {
         await message.send(thumbnail, {
            caption: aliveMessage,
            contextInfo: {
               forwardingScore: 1,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363327841612745@newsletter",
                  newsletterName: "ᴀʟɪᴠᴇ ᴍsɢ",
               },
            },
         });
      } catch (error) {
         console.error("Error sending alive message:", error);
         await message.reply("An error occurred while sending the alive message. Please try again later.");
      }
   }
);

command(
   {
      pattern: "url",
      fromMe: mode,
      desc: "Shortens Url",
      type: "misc",
   },
   async (message, match) => {
      if (!match) return await message.sendReply("_Provide me A URL_");
      await message.sendReply("_Shorting link_");
      const url = await shortenUrl(match);
      const msg = `_Here's your link *${url}*_`;
      return await message.send(msg);
   }
);
