const { command, processAudio, mode } = require("../lib");

const effects = ["bass", "blown", "deep", "earrape", "fast", "fat", "nightcore", "reverse", "robot", "slow", "smooth", "tupai"];
effects.forEach(effect => {
 command(
  {
   pattern: effect,
   fromMe: mode,
   info: `Adds ${effect} effect to the given sound`,
   type: "audio",
  },
  async (message, match, m) => {
   if (!message.reply_message.audio) return message.sendReply("_Reply An Audio Only!_");
   await message.sendReply("_Processing Audio file!_");
   let getAudio = await m.quoted.download();
   getAudio = await processAudio(getAudio, effect);
   return await message.sendMessage(message.jid, getAudio, { mimetype: "audio/mpeg" }, "audio");
  }
 );
});
