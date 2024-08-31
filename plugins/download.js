const { Module, IronMan, Scraper, mode } = require("../lib");
const axios = require("axios");
Module(
 {
  pattern: "insta",
  fromMe: true,
  desc: "Downlaod post or reel from Instagram",
  type: "downloader",
 },
 async (message, match, m) => {
  if (!match || !match.includes("instagram.com")) {
   return await message.reply("Need an Instagram URL.");
  }

  try {
   const res = await axios.get(IronMan(`ironman/dl/v2/insta?url=${match}`));
   const data = res.data;

   if (data.status === 200 && Array.isArray(data.media) && data.media.length > 0) {
    for (const url of data.media) {
     if (url) {
      if (match.includes("/p/")) {
       await message.client.sendMessage({ image: { url } });
      } else if (match.includes("/reel/") || match.includes("/tv/")) {
       await message.client.sendMessage({ video: { url } });
      } else {
       await message.client.sendMessage({ video: { url } });
      }
     }
    }
   } else {
    throw new Error("No media found./nCheck if your url is valid");
   }
  } catch (error) {
   await message.reply("No media found./nCheck if your url is valid");
  }
 }
);

Module(
 {
  pattern: "facebook",
  fromMe: mode,
  desc: "Download Facebook Videos & Images ",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide facebook url_");
  await message.sendReply("_downloading_");
  const fb = new Scraper();
  const buff = await fb.facebook(match);
  return await message.sendFile(buff);
 }
);
