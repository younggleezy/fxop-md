const axios = require("axios");
const API = "https://pure-badlands-26930-091903776676.herokuapp.com/";

class ScrapeDl {
 async facebook(query) {
  const trimmedQuery = query.trim();
  const url = `download/facebook?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const hdUrl = response.data.data.hd;
  const videoResponse = await axios.get(hdUrl, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async instagram(query) {
  const trimmedQuery = query.trim();
  const url = `download/instagram?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async twitter(query) {
  const trimmedQuery = query.trim();
  const url = `download/twitter?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async tiktok(query) {
  const trimmedQuery = query.trim();
  const url = `download/tiktok?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async spotify(query) {
  const trimmedQuery = query.trim();
  const url = `download/spotify?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const music = response.data.data.link;
  const videoResponse = await axios.get(music, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async pinterest(query) {
  const trimmedQuery = query.trim();
  const url = `download/pinterest?query=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const images = response.data.results;
  const randomIndex = Math.floor(Math.random() * images.length);
  const imageUrl = images[randomIndex];
  const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(imageResponse.data);
 }
 async youtube(query) {
  const trimmedQuery = query.trim();
  const url = `download/youtube?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.url;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
 async ytmp3(query) {
  const trimmedQuery = query.trim();
  const url = `download/ytmp3?url=${encodeURIComponent(trimmedQuery)}`;
  const response = await axios.get(API + url, { responseType: "json" });
  const media = response.data.audio;
  const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(videoResponse.data);
 }
}

module.exports = ScrapeDl;
