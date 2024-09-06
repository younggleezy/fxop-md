const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cheerio = require("cheerio");
const API = "https://astro-api-crqy.onrender.com/";
const ai_api = `https://api.vihangayt.com/`;
const gifted_api = `https://api.giftedtechnexus.co.ke/api/`;

async function facebook(query) {
  const trimmedQuery = query.trim();
  const url = `download/facebook?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const hdUrl = response.data.data.hd;
  const videoResponse = await axios.get(hdUrl, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function instagram(query) {
  const trimmedQuery = query.trim();
  const url = `https://ironman.koyeb.app/ironman/dl/v2/insta?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(url, { responseType: "json" });
  const media = response.data.media[0];
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function twitter(query) {
  const trimmedQuery = query.trim();
  const url = `download/twitter?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function tiktok(query) {
  const trimmedQuery = query.trim();
  const url = `download/tiktok?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function spotify(query) {
  const trimmedQuery = query.trim();
  const url = `download/spotify?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const music = response.data.data.link;
  const videoResponse = await axios.get(music, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function pinterest(query) {
  const trimmedQuery = query.trim();
  const url = `download/pinterest?query=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const images = response.data.results;
  const randomIndex = Math.floor(Math.random() * images.length);
  const imageUrl = images[randomIndex];
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  return Buffer.from(imageResponse.data);
}

async function youtube(query) {
  const trimmedQuery = query.trim();
  const url = `download/youtube?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

async function ytmp3(query) {
  const trimmedQuery = query.trim();
  const url = `download/ytmp3?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.audio;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
}

function Telegraph(filePath) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error("File not found"));
    }

    try {
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));

      const response = await axios({
        url: "https://telegra.ph/upload",
        method: "POST",
        headers: {
          ...form.getHeaders(),
        },
        data: form,
      });

      const fileUrl = "https://telegra.ph" + response.data[0].src;
      resolve(fileUrl);
    } catch (error) {
      reject(new Error(error.message));
    }
  });
}

async function uploadToUguu(filePath) {
  return new Promise(async (resolve, reject) => {
    const form = new FormData();
    form.append("files[]", fs.createReadStream(filePath));

    try {
      const response = await axios({
        url: "https://uguu.se/upload.php",
        method: "POST",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
          ...form.getHeaders(),
        },
        data: form,
      });

      resolve(response.data.files[0]);
    } catch (error) {
      reject(error);
    }
  });
}

function WebpToMp4(filePath) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("new-image-url", "");
    form.append("new-image", fs.createReadStream(filePath));

    axios({
      method: "POST",
      url: "https://s6.ezgif.com/webp-to-mp4",
      data: form,
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + form._boundary,
      },
    })
      .then(({ data: initialResponse }) => {
        const form2 = new FormData();
        const $ = cheerio.load(initialResponse);
        const fileValue = $("input[name='file']").attr("value");

        form2.append("file", fileValue);
        form2.append("convert", "Convert WebP to MP4!");

        axios({
          method: "POST",
          url: "https://ezgif.com/webp-to-mp4/" + fileValue,
          data: form2,
          headers: {
            "Content-Type": "multipart/form-data; boundary=" + form2._boundary,
          },
        })
          .then(({ data: conversionResponse }) => {
            const $ = cheerio.load(conversionResponse);
            const mp4Url =
              "https:" +
              $("div#output > p.outfile > video > source").attr("src");

            resolve({
              status: true,
              message: "Created By MRHRTZ",
              result: mp4Url,
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

async function coderAi(code) {
  const trimcode = code.trim();
  const url = `ai/codemirror?q=${encodeURIComponent(trimcode)}`;
  const response = await axios.get(ai_api + url);
  const data = response.data;
  return data.data.prediction;
}
async function gpt4(question) {
  const trimquestion = question.trim();
  const url = `ai/gpt4-v2?q=${encodeURIComponent(trimquestion)}`;
  const response = await axios.get(ai_api + url);
  const data = response.data;
  return data.data;
}

async function lamda(question) {
  const trimquestion = question.trim();
  const url = `ai/lamda?q=${encodeURIComponent(trimquestion)}`;
  const response = await axios.get(ai_api + url);
  const data = response.data;
  return data.data;
}

async function stableDiff(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `ai/sd?prompt=${encodedQuery}&apikey=giftedtechk`;
  const response = await axios.get(gifted_api + url, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data);
  return buffer;
}

async function lyrics(songName) {
  const encodeSong = encodeURIComponent(songName.trim());
  const url = `search/lyrics?query=${encodeSong}&apikey=giftedtechk`;
  const response = await axios.get(gifted_api + url);
  const data = response.data.result;
  const songLyrics = `*Artist: ${data.Artist}*\n*Song: ${data.Title}*\nLyrics: ${data.Lyrics}`;
  return songLyrics;
}

async function askAi(aiType, query) {
  const BASE_URL = "https://ironman.koyeb.app/";
  const API_KEY = "Ir0n-M4n_xhf04";
  const IMAGE_API_KEY = "img-1r0nm4nH4x!";

  const apiPaths = {
    aoyo: "ironman/ai/aoyo",
    thinkany: "ironman/ai/thinkany",
    prodia: "ironman/ai/prodia",
    lepton: "ironman/ai/llm",
    gpt: "ironman/ai/gpt",
    blackbox: "ironman/ai/blackbox",
    chatgpt: "ironman/ai/chatev",
    dalle: "ironman/ai/dalle",
    upscale: "ironman/ai/upscale",
  };

  try {
    switch (aiType) {
      case "aoyo": {
        const { data: aoyoResponse } = await axios.get(
          `${BASE_URL}${apiPaths.aoyo}`,
          {
            headers: { ApiKey: API_KEY },
            params: { query: query },
          },
        );
        return aoyoResponse;
      }

      case "thinkany": {
        const { data: thinkanyResponse } = await axios.get(
          `${BASE_URL}${apiPaths.thinkany}?query=${query}`,
          {
            headers: { ApiKey: API_KEY },
          },
        );
        return thinkanyResponse;
      }

      case "prodia": {
        return `${BASE_URL}${apiPaths.prodia}?prompt=${query}&ApiKey=${IMAGE_API_KEY}`;
      }

      case "lepton": {
        const { data: leptonResponse } = await axios.get(
          `${BASE_URL}${apiPaths.lepton}?query=${query}`,
          {
            headers: { ApiKey: API_KEY },
          },
        );
        return leptonResponse;
      }

      case "gpt": {
        const { data: gptResponse } = await axios.get(
          `${BASE_URL}${apiPaths.gpt}?prompt=${query}`,
          {
            headers: { ApiKey: API_KEY },
          },
        );
        return gptResponse;
      }

      case "blackbox": {
        const { data: blackboxResponse } = await axios.get(
          `${BASE_URL}${apiPaths.blackbox}?query=${query}`,
          {
            headers: { ApiKey: API_KEY },
          },
        );
        return blackboxResponse;
      }

      case "chatgpt": {
        const { data: chatgptResponse } = await axios.get(
          `${BASE_URL}${apiPaths.chatgpt}?prompt=${query}`,
          {
            headers: { ApiKey: API_KEY },
          },
        );
        return chatgptResponse;
      }

      case "dalle": {
        return `${BASE_URL}${apiPaths.dalle}?text=${encodeURIComponent(query)}&ApiKey=${IMAGE_API_KEY}`;
      }

      case "upscale": {
        if (!Buffer.isBuffer(query)) {
          throw new Error("Expected a buffer for the image.");
        }

        const formData = new FormData();
        formData.append("image", query, { filename: "image.jpg" });
        const upscaleResponse = await axios.post(
          `${BASE_URL}${apiPaths.upscale}?ApiKey=${IMAGE_API_KEY}`,
          formData,
          {
            headers: formData.getHeaders(),
            responseType: "arraybuffer",
          },
        );
        return upscaleResponse.data;
      }

      default:
        throw new Error("Invalid AI type provided.");
    }
  } catch (error) {
    console.error(`Error interacting with AI: ${error.message}`);
    throw error;
  }
}

async function google(query) {
  const url = `https://pure-badlands-26930-091903776676.herokuapp.com/search/google?q=${encodeURIComponent(query)}`;

  const response = await axios.get(url);
  const results = response.data.results;
  const formattedResults = results
    .map((result) => {
      return `Title: ${result.title}\nLink: ${result.link}\nSnippet: ${result.snippet}\n`;
    })
    .join("\n");
  return formattedResults;
}

async function dalle(prompt) {
  const url = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(prompt)}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

async function bing(query) {
  const url = `https://gpt4.guruapi.tech/bing?username=astro&query=${encodeURIComponent(query)}`;
  const response = await axios.get(url);
  return response.data.result;
}

async function elevenlabs(text) {
  const url = `https://pure-badlands-26930-091903776676.herokuapp.com/ai/generate-audio?text=${encodeURIComponent(text)}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const audioBuffer = Buffer.from(response.data);
  return audioBuffer;
}
const shortenUrl = async (longUrl) => {
  const encodedUrl = encodeURIComponent(longUrl.trim());
  const response = await axios.post(
    "https://cleanuri.com/api/v1/shorten",
    `url=${encodedUrl}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return response.data.result_url;
};

module.exports = {
  facebook,
  instagram,
  twitter,
  tiktok,
  spotify,
  pinterest,
  youtube,
  ytmp3,
  Telegraph,
  uploadToUguu,
  WebpToMp4,
  coderAi,
  gpt4,
  lamda,
  stableDiff,
  lyrics,
  askAi,
  google,
  dalle,
  bing,
  elevenlabs,
  shortenUrl,
};
