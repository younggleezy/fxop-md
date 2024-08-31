const axios = require("axios");
const BASE_API = `https://astro-api-v1-b263985f7644.herokuapp.com`;

class Scraper {
 async youtube(query) {
  const ytul = `/download/youtube?url=`;
  const apiResponse = await axios.get(BASE_API + ytul + query);
  const downloadUrl = apiResponse.data.url;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async facebook(query) {
  const fbul = `/download/facebook?url=`;
  const apiResponse = await axios.get(BASE_API + fbul + query);
  const downloadUrl = apiResponse.data.data.hd;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async youtubeMp3(query) {
  const ytaul = `/download/ytmp3?url=`;
  const apiResponse = await axios.get(BASE_API + ytaul + query);
  const downloadUrl = apiResponse.data.audio;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async instagram(query) {
  const instaul = `/download/instagram?url=`;
  const apiResponse = await axios.get(BASE_API + instaul + query);
  const downloadUrl = apiResponse.data.url;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async twitter(query) {
  const xurl = `/download/twitter?url=`;
  const apiResponse = await axios.get(BASE_API + xurl + query);
  const downloadUrl = apiResponse.data.url;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async tiktok(query) {
  const tikurl = `/download/tiktok?url=`;
  const apiResponse = await axios.get(BASE_API + tikurl + query);
  const downloadUrl = apiResponse.data.url;
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 async pinterest(query) {
  const pinturl = `/download/pinterest?query=`;
  const apiResponse = await axios.get(BASE_API + pinturl + query);
  const downloadUrl = apiResponse.data.results;
  const ranImgs = Math.floor(Math.random() * downloadUrl.length);
  const buff = downloadUrl[ranImgs];
  if (!downloadUrl) throw new Error("Download URL not found");
  const response = await axios.get(buff, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
 }
 /**
  *
  */
 async gpt4(query) {
  const gpturl = `/ai/chatgpt?q=`;
  const apiResponse = await axios.get(BASE_API + gpturl + query);
  if (apiResponse.data.success && apiResponse.data.result) {
   return apiResponse.data.result;
  } else {
   throw new Error("API ERROR");
  }
 }
}
module.exports = { Scraper };

// async function test(query) {
//  const downloader = new Scraper();
//  const data = await downloader.gpt4(query);
//  console.log(data);
// }
// test("what is life in 3 words");
