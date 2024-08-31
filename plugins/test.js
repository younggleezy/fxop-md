const { Module, mode } = require("../lib");

Module(
 {
  pattern: "test(?: |$)(.*)",  // Updated pattern to better capture arguments
  info: "Logic Test",
  fromMe: mode,
  type: "tests",
 },

 async (message, match) => {
  // The first message is always sent
  await message.send("This is a normal logic");

  // Log the match for debugging
  console.log("Match:", match);

  // Check if there's a match and if it's 'now'
  if (match && match.trim().toLowerCase() === 'now') {
    await message.send("other logic success");
  }
 }
);