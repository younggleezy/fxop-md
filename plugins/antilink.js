const { mode, command } = require("../lib/");
const { setAntiLink, getAntiLink } = require("../lib/database/antilink");

command(
 {
  pattern: "antilink ?(.*)",
  fromMe: mode,
  desc: "to on off antiLink",
  type: "group",
 },
 async (message, match) => {
  const antilink = await getAntiLink(message.jid);
  if (!match) {
   const onOrOff = antilink.enabled ? "on" : "off";
   return await message.send(`_Antilink is ${onOrOff}_\n*Example :*\nantilink info\nantilink whatsapp.com\nantlink on | off`);
  }
  if (match == "on" || match == "off") {
   if (match == "off" && !antilink) return await message.send("_AntiLink is not enabled._");
   await setAntiLink(message.jid, match == "on");
   return await message.send(`_AntiLink ${match == "on" ? "Enabled" : "Disabled."}_`);
  }
  if (match == "info") return await message.send(`*AntiLink :* ${antilink.enabled ? "on" : "off"}\n*AllowedUrl :* ${antilink.allowedUrls}\n*Action :* ${antilink.action}`);
  if (match.startsWith("action/")) {
   await setAntiLink(message.jid, match);
   const action = match.replace("action/", "");
   if (!["warn", "kick", "null"].includes(action)) return await message.send("*Invalid action*");
   return await message.send(`_AntiLink action updated as ${action}_`);
  }
  const res = await setAntiLink(message.jid, match);
  return await message.send(`_AntiLink allowed urls are_\nAllow - ${res.allow.join(", ")}\nNotAllow - ${res.notallow.join(", ")}`);
 }
);
