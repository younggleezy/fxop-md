const { command, mode } = require("../lib");
const aiResponse = require("../lib/scraper");

command(
 {
  pattern: "codeai",
  fromMe: mode,
  desc: "Code With Copliot Mirror",
  type: "ai",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_Hello What Code Do You Help For?_");
  await message.reply("_Analyzing Request_");
  const processedMsg = await aiResponse.coderAi(match);
  return await message.send(processedMsg);
 }
);
