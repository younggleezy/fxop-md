const { Module, mode } = require("../lib/");
Module(
 {
  pattern: "ping",
  fromMe: mode,
  desc: "To check ping",
  type: "user",
 },
 async (message, match) => {
  const start = new Date().getTime();
  const sentMessage = await message.sendMessage("```Ping!```");
  const end = new Date().getTime();
  const pingTime = end - start;
  await message.edit(`*Pong!*\n ${pingTime} *ms*`, sentMessage.key);
 }
);
