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

command(
 {
  pattern: "gpt4",
  fromMe: true,
  desc: "Chat With Gpt4 AI Model",
  type: "ai",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_Hello How Can I Assist You Today?_");
  await message.reply("_Hold On!_");
  const processedMsg = await aiResponse.gpt4(match);
  return await message.send(processedMsg);
 }
);
