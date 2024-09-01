const API = "https://pure-badlands-26930-091903776676.herokuapp.com/";
const axios = require("axios");

class Scraper {
 async facebook(query) {
  const url = "download/facebook?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.data.hd, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async instagram(query) {
  const url = "download/instagram?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.url, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async twitter(query) {
  const url = "download/twitter?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.url, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async tiktok(query) {
  const url = "download/tiktok?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.url, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async pinterest(query) {
  const url = "download/pinterest?query=";
  const request = await axios.get(API + url + query);
  if (!request.data.results || !Array.isArray(request.data.results) || request.data.results.length === 0) {
   throw new Error("No results found in the response.");
  }
  const randomIndex = Math.floor(Math.random() * request.data.results.length);
  const randomImageUrl = request.data.results[randomIndex];
  const response = await axios.get(randomImageUrl, {
   responseType: "arraybuffer",
  });
  const imageBuffer = Buffer.from(response.data);
  return imageBuffer;
 }

 async ytmusic(query) {
  const url = "download/ytmp3?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.audio, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async youtube(query) {
  const url = "download/youtube?url=";
  const request = await axios.get(API + url + query);
  const response = await axios.get(request.data.url, {
   responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
 }
 async google(query) {
  const url = "search/google?q=";
  const request = await axios.get(API + url + query);
  const results = request.data.results;
  const resultsString = results.map((result) => `Title: ${result.title}\nLink: ${result.link}\nSnippet: ${result.snippet}`).join("\n\n");
  return resultsString;
 }
 async apksearch(query) {}
 async weather(query) {}
 async nasa(query) {}
 async technews(query) {}
 async gpt(query) {}
 async blackbox(query) {}
 async elevenlabs(query) {}
 async gitstalk(query) {}
 async instastalk(query) {}
 async ipstalk(query) {}
 async npmstalk(query) {}
 async jokes(query) {}
 async qrmaker(query) {}
 async base64(query) {}
 async decbase64(query) {}
}

class Anime {
 async angry() {}
 async clam() {}
 async confused() {}
 async dance() {}
 async embrass() {}
 async happy() {}
 async lunch() {}
 async misc() {}
 async no() {}
 async prexerices() {}
 async sad() {}
 async smug() {}
 async surprised() {}
 async thinking() {}
 async yes() {}
}
module.exports = { Scraper, Anime };
