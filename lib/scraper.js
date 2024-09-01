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
 async instagram(query) {}
 async twitter(query) {}
 async tiktok(query) {}
 async pinterest(query) {}
 async ytmusic(query) {}
 async youtube(query) {}
 async google(query) {}
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
