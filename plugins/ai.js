const { Module, mode, Scraper } = require("../lib");

Module(
 {
  pattern: "gpt",
  fromMe: mode,
  desc: "Chat with gpt4",
  type: "ai",
 },
 async (message, match) => {
  if (!match) return message.sendReply("hmm, give me something");
  const msg = await message.reply("_thinking_");
  const request = new Scraper();
  const result = await request.gpt4(match);
  return await msg.edit(`*GPT4: ${result}`);
 }
);
