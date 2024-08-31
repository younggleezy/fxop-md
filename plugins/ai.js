const { Module, mode, Scraper } = require("../lib");

Module(
 {
  pattern: "gpt",
  fromMe: mode,
  desc: "Chat with gpt4",
  type: "ai",
 },
 async (message, match) => {
  if (!match) return message.sendReply("*_hmm, give me something_*");
  const msg = await message.reply("_thinking_");
  const request = new Scraper();
  const result = await request.gpt4(match);
  return await msg.edit(`*GPT4:*\n ${result}`);
 }
);

Module(
 {
  pattern: "blackbox",
  fromMe: mode,
  desc: "Chat with BlackBox Ai",
  type: "ai",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("*_look i can't deal with empty queries_*");
  const msg = await message.reply("_thinking_");
  const request = new Scraper();
  const result = await request.blackbox(match);
  return await msg.edit(`*BlackBox:*\n ${result}`);
 }
);
