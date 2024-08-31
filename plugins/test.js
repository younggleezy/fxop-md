const { Module, mode } = require("../lib");

Module(
 {
  pattern: "test",
  info: "Logic Test",
  fromMe: mode,
  type: "tests",
 },

 async (message, match) => {
  await message.send("This is a normal logic");

  if (match.includes("now")) {
   await message.send("other logic success");
  }
 }
);
