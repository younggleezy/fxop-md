const { command, mode } = require("../lib");
const { ScrapeDl } = require("../lib/scraper");
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
  const buff = new media.facebook(match);
  return message.sendFile(buff);
 }
);
