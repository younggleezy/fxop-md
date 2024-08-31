const { Module, mode } = require("../lib");

Module(
 {
  pattern: "test", // Updated pattern to better capture arguments
  info: "Logic Test",
  fromMe: mode,
  type: "tests",
 },

 async (message, match) => {
  await message.send("This is a normal logic");

  if (match == "now") {
   await message.send("hmm");
  }
 }
);
