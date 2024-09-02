const { command, mode } = require("../lib");
const ScrapeDl = require("../lib/scraper");
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
  const buff = await ScrapeDl.facebook(match);
  return message.sendFile(buff);
 }
);

// command(
//  {
//   pattern: "instagram",
//   fromMe: mode,
//   desc: "Downloads Instagram Media",
//   type: "download",
//  },
//  async (message, match) => {
//   if (!match) return message.reply("_provide vaild instagram link_");
//   await message.reply("_Downloading_");
//   const buff = await ScrapeDl.instagram(match);
//   return message.sendFile(buff);
//  }
// );

command(
 {
  pattern: "twitter",
  fromMe: true,
  desc: "Downloads Twitter Media",
  type: "download",
 },
 async (message, match) => {
  if (!match) return message.reply("_provide vaild twitter url_");
  await message.reply("_Downloading_");
  const buff = await ScrapeDl.twitter(match);
  return await message.sendFile(buff);
 }
);

command(
 {
  pattern: "tiktok",
  fromMe: true,
  desc: "Downloads Tiktok Media",
  type: "download",
 },
 async (message, match) => {
  if (!match) return await message.reply("_provide tiktok url_");
  await message.reply("_Downloading_");
  const buff = await ScrapeDl.tiktok(match);
  return await message.sendFile(buff);
 }
);
