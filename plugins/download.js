const { command, mode, ScrapeDl } = require("../lib");
command(
 {
  pattern: "facebook",
  fromMe: mode,
  desc: "Downloads Facebook Media",
  type: "download",
 },
 async (message, match) => {
  if (!match) return message.reply("_provide vaild facebook link_");
  await message.reply("_Downloading_");
  const media = new ScrapeDl();
  const buff = await media.facebook(match);
  return message.sendFile(buff);
 }
);

command(
 {
  pattern: "instagram",
  fromMe: mode,
  desc: "Downloads Instagram Media",
  type: "download",
 },
 async (message, match) => {
  if (!match) return message.reply("_provide vaild instagram link_");
  await message.reply("_Downloading_");
  const media = new ScrapeDl();
  const buff = await media.instagram(match);
  return message.sendFile(buff);
 }
);

command(
 {
  pattern: "twitter", 
  fromMe: true,
  desc: "Downloads Twitter Media", 
  type: "download" 
  }, 
 async (message, match) => {

 }
) 
