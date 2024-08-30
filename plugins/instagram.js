const { Module, IronMan } = require("../lib");
const axios = require("axios");

Module(
  {
    pattern: "insta ?(.*)",
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

      if (
        data.status === 200 &&
        Array.isArray(data.media) &&
        data.media.length > 0
      ) {
        for (const url of data.media) {
          if (url) {
            if (match.includes("/p/")) {
              await message.client.sendMessage(message.jid, { image: { url } });
            } else if (match.includes("/reel/") || match.includes("/tv/")) {
              await message.client.sendMessage(message.jid, { video: { url } });
            } else {
              await message.client.sendMessage(message.jid, { video: { url } });
            }
          }
        }
      } else {
        throw new Error("No media found./nCheck if your url is valid");
      }
    } catch (error) {
      await message.reply("No media found./nCheck if your url is valid");
    }
  },
);
