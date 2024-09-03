const { command, mode } = require("../lib");
const ScrapeSrc = require("../lib/scraper");

command(
 {
  pattern: "lyrics",
  fromMe: mode,
  desc: "Search and Get Song Lyrics",
  type: "search",
 },
 async (m, match) => {
  if (!match) return await m.sendReply("_Hmm Provide Me A Song Name_");
  await m.reply("_Searching Lyrics!_");
  const lyricsMsg = await ScrapeSrc.lyrics(match);
  return await m.send(lyricsMsg);
 }
);
