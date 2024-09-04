const { command, wcg } = require("../lib/");
command(
 {
  pattern: "wcg ?(.*)",
  desc: "word chain game\nwcg start to force start game",
  type: "game",
 },
 async (message, match) => {
  if (match == "start") {
   return await wcg.start(message.jid, message.participant);
  }
  if (match == "end") {
   return await wcg.end(message.jid, message.participant);
  }
  wcg.start_game(message.jid, message.participant, "chain", match);
 }
);

command(
 {
  pattern: "wrg ?(.*)",
  desc: "random word game\nwrg start to force start game",
  type: "game",
 },
 async (message, match) => {
  if (match == "start") {
   return await wcg.start(message.jid, message.participant);
  }
  if (match == "end") {
   return await wcg.end(message.jid, message.participant);
  }
  wcg.start_game(message.jid, message.participant, "random", match);
 }
);
