const { command, mode } = require("../lib");
const runtime = require("./_menu");
const { exec } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database").Plugins;

command(
 {
  pattern: "restart",
  fromMe: true,
  desc: "Restart the bot",
  type: "system",
 },
 async messsage => {
  await messsage.send(messsage.jid, "restarting process...");
  exec("pm2 restart fxop", error => {
   if (error) {
    return messsage.send(`Error: ${error}`);
   }
  });
 }
);
command(
 {
  pattern: "shutdown",
  fromMe: true,
  desc: "Shut down bot",
  type: "system",
 },
 async messsage => {
  await messsage.send("restarting process...");
  exec("pm2 stop fxop", error => {
   if (error) {
    return messsage.send(`Error: ${error}`);
   }
  });
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
  pattern: "runtime ?(.*)",
  fromMe: true,
  desc: "Check uptime of bot",
  type: "system",
 },
 async message => {
  message.send(`*Uptime:* ${runtime(process.uptime())}`);
 }
);

command(
 {
  pattern: "install",
  fromMe: true,
  desc: "Installs External plugins",
  type: "system",
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

command({ pattern: "plugin", fromMe: true, desc: "plugin list", type: "system" }, async message => {
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
  type: "system",
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
