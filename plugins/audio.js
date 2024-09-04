const { command, mode } = require("../lib");
const ffmpeg = require("fluent-ffmpeg");
const { Readable, PassThrough } = require("stream");

/**
 * Processes audio with the specified effect using ffmpeg.
 * @param {Buffer} audioBuffer - The input audio as a buffer.
 * @param {string} effect - The audio effect to apply.
 * @returns {Promise<Buffer>} - The processed audio as a buffer.
 */
function editAudio(audioBuffer, effect = "bass") {
 const filters = {
  bass: "-af equalizer=f=54:width_type=o:width=2:g=20",
  blown: "-af acrusher=.1:1:64:0:log",
  deep: "-af atempo=4/4,asetrate=44500*2/3",
  earrape: "-af volume=12",
  fast: '-filter:a "atempo=1.63,asetrate=44100"',
  fat: '-filter:a "atempo=1.6,asetrate=22100"',
  nightcore: "-filter:a atempo=1.06,asetrate=44100*1.25",
  reverse: '-filter_complex "areverse"',
  robot: "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"",
  slow: '-filter:a "atempo=0.7,asetrate=44100"',
  smooth: "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"",
  tupai: '-filter:a "atempo=0.5,asetrate=65100"',
 };

 const filter = filters[effect] || filters.bass;

 return new Promise((resolve, reject) => {
  const outputBuffers = [];
  const inputStream = Readable.from(audioBuffer);
  const outputStream = new PassThrough();

  ffmpeg(inputStream)
   .inputFormat("mp3")
   .audioFilters(filter)
   .audioCodec("libmp3lame") // Explicitly set codec
   .toFormat("mp3")
   .on("error", err => {
    reject(new Error(`FFmpeg processing failed: ${err.message}`));
   })
   .on("end", () => {
    resolve(Buffer.concat(outputBuffers));
   })
   .pipe(outputStream);

  outputStream.on("data", chunk => {
   outputBuffers.push(chunk);
  });

  outputStream.on("end", () => {
   resolve(Buffer.concat(outputBuffers));
  });
 });
}

/**
 * Main function to process audio with a specified effect.
 * @param {Buffer} inputBuffer - The input audio buffer.
 * @param {string} effect - The audio effect to apply.
 * @returns {Promise<Buffer>} - The processed audio buffer.
 */
async function processAudio(inputBuffer, effect = "bass") {
 try {
  const processedBuffer = await editAudio(inputBuffer, effect);
  return processedBuffer;
 } catch (error) {
  console.error("Error processing audio:", error.message || error); // Improve error logging
  throw error;
 }
}

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
   try {
    getAudio = await processAudio(getAudio, effect);
    return await message.sendMessage(message.jid, getAudio, { mimetype: "audio/mpeg" }, "audio");
   } catch (error) {
    console.error("Failed to send processed audio:", error.message || error);
    return message.sendReply("_Failed to process audio!_");
   }
  }
 );
});
