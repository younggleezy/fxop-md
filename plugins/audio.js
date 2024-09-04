const { command, editAudio } = require("../lib");

/**
 * Handles the audio effect command.
 * @param {Object} message - The message object.
 * @param {string} effectName - The effect to apply.
 */
async function effectAudio(message, effectName, m) {
 if (!message.reply_message || !message.reply_message.audio) {
  return await message.send("_Reply Audio/Voice Note Only!_");
 }
 const audioBuffer = await m.quoted.download();
 const processedAudio = await editAudio(audioBuffer, effectName);
 await message.sendMessage(
  message.jid,
  {
   audio: processedAudio,
   mimetype: "audio/mpeg",
   ptt: /ptt|voice/.test(message.test || "") ? true : false,
  },
  {
   quoted: message,
  }
 );
}

const effects = ["bass", "blown", "deep", "earrape", "fast", "fat", "nightcore", "reverse", "robot", "slow", "smooth", "tupai"];
effects.forEach(effect => {
 command(
  {
   pattern: effect,
   info: `Adds ${effect} effect to the given sound`,
   type: "audio",
  },
  async (message, match) => {
   return await effectAudio(message, effect);
  }
 );
});
