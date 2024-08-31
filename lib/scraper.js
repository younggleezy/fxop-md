const axios = require("axios");
const BASE_API = `https://pure-badlands-26930-091903776676.herokuapp.com`;

class Scraper {
  async fetchDownloadUrl(endpoint, query, responseKey) {
    try {
      const apiResponse = await axios.get(`${BASE_API}${endpoint}${query}`);
      const downloadUrl = responseKey ? apiResponse.data[responseKey] : apiResponse.data.url;
      if (!downloadUrl) throw new Error("Download URL not found");
      return downloadUrl;
    } catch (error) {
      console.error(`Error fetching download URL for endpoint ${endpoint}:`, error.message);
      throw new Error("Failed to fetch download URL");
    }
  }

  async downloadFile(url) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Error downloading file from ${url}:`, error.message);
      throw new Error("Failed to download file");
    }
  }

  async youtube(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/youtube?url=`, query);
    return this.downloadFile(downloadUrl);
  }

  async facebook(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/facebook?url=`, query, "data.hd");
    return this.downloadFile(downloadUrl);
  }

  async youtubeMp3(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/ytmp3?url=`, query, "audio");
    return this.downloadFile(downloadUrl);
  }

  async instagram(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/instagram?url=`, query);
    return this.downloadFile(downloadUrl);
  }

  async twitter(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/twitter?url=`, query);
    return this.downloadFile(downloadUrl);
  }

  async tiktok(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/tiktok?url=`, query);
    return this.downloadFile(downloadUrl);
  }

  async pinterest(query) {
    const downloadUrlList = await this.fetchDownloadUrl(`/download/pinterest?query=`, query, "results");
    if (!downloadUrlList || downloadUrlList.length === 0) throw new Error("Download URLs not found");
    const randomImage = downloadUrlList[Math.floor(Math.random() * downloadUrlList.length)];
    return this.downloadFile(randomImage);
  }

  async spotify(query) {
    const downloadUrl = await this.fetchDownloadUrl(`/download/spotify?url=`, query, "data.link");
    return this.downloadFile(downloadUrl);
  }

  async gpt4(query) {
    const result = await this.fetchDownloadUrl(`/ai/chatgpt?q=`, query, "result");
    return result || "No result found";
  }

  async blackbox(query) {
    const result = await this.fetchDownloadUrl(`/ai/blackbox?q=`, query, "result");
    return result || "No result found";
  }
}

module.exports = { Scraper };
