const { command } = require("../lib");
const ffmpeg = require("fluent-ffmpeg");
const { Readable } = require("stream");

/**
 * Processes audio with the specified effect using ffmpeg.
 * @param {Buffer} audioBuffer - The input audio as a buffer.
 * @param {string} effect - The audio effect to apply.
 * @returns {Promise<Buffer>} - The processed audio as a buffer.
 */
async function editAudio(audioBuffer, effect = "bass") {
 return new Promise((resolve, reject) => {
  let filter = "-af equalizer=f=54:width_type=o:width=2:g=20";
  switch (effect) {
   case "bass":
    filter = "-af equalizer=f=54:width_type=o:width=2:g=20";
    break;
   case "blown":
    filter = "-af acrusher=.1:1:64:0:log";
    break;
   case "deep":
    filter = "-af atempo=4/4,asetrate=44500*2/3";
    break;
   case "earrape":
    filter = "-af volume=12";
    break;
   case "fast":
    filter = '-filter:a "atempo=1.63,asetrate=44100"';
    break;
   case "fat":
    filter = '-filter:a "atempo=1.6,asetrate=22100"';
    break;
   case "nightcore":
    filter = "-filter:a atempo=1.06,asetrate=44100*1.25";
    break;
   case "reverse":
    filter = '-filter_complex "areverse"';
    break;
   case "robot":
    filter = "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"";
    break;
   case "slow":
    filter = '-filter:a "atempo=0.7,asetrate=44100"';
    break;
   case "smooth":
    filter = "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"";
    break;
   case "tupai":
    filter = '-filter:a "atempo=0.5,asetrate=65100"';
    break;
   default:
    filter = "-af equalizer=f=54:width_type=o:width=2:g=20";
    break;
  }

  const inputStream = Readable.from(audioBuffer); // Convert buffer to readable stream
  const outputBuffers = [];

  // Run ffmpeg processing
  ffmpeg(inputStream)
   .inputFormat("mp3") // Ensure input format
   .audioFilters(filter) // Apply the filter
   .format("mp3") // Output format
   .on("error", err => {
    reject(new Error(`FFmpeg processing failed: ${err.message}`));
   })
   .on("end", () => {
    resolve(Buffer.concat(outputBuffers)); // Return the buffer
   })
   .on("data", chunk => {
    outputBuffers.push(chunk); // Collect data chunks
   })
   .pipe(); // Pipe to buffer stream
 });
}

const effects = ["bass", "blown", "deep", "earrape", "fast", "fat", "nightcore", "reverse", "robot", "slow", "smooth", "tupai"];
effects.forEach(effect => {
 command(
  {
   pattern: effect,
   info: `Adds ${effect} effect to the given sound`,
   type: "audio",
  },
  async (message, match, m) => {
   if (!message.reply_message || !message.reply_message.audio) {
    return await message.send("_Reply Audio/Voice Note Only!_");
   }

   try {
    const audioBuffer = await m.quoted.download();
    const processedAudio = await editAudio(audioBuffer, effect);
    return await message.sendMessage(
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
   } catch (error) {
    await message.send(`Error processing audio: ${error.message}`);
    console.error("Error processing audio effect:", error);
   }
  }
 );
});
