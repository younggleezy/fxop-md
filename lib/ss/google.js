const axios = require("axios");
async function google(query) {
   const url = `https://astro-api-crqy.onrender.com/api/google-search?q=${encodeURIComponent(query)}`;

   const response = await axios.get(url);
   const results = response.data.results;
   const formattedResults = results
      .map(result => {
         return `Title: ${result.title}\nLink: ${result.link}\nSnippet: ${result.snippet}\n`;
      })
      .join("\n");
   return formattedResults;
}
module.exports = { google };
