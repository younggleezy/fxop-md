const isTwiiterUrl = url => {
 const twitterPattern = /^(https?:\/\/)?(www\.)?twitter\.com\/.+$/ || /^(https?:\/\/)?(www\.)?x\.com\/.+$/
 return twitterPattern.test(url)
}
const isFacebookUrl = url => {
 const facebookPattern = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/
 return facebookPattern.test(url)
}
const isInstagramUrl = url => {
 const instagramPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/
 return instagramPattern.test(url)
}
const isLinkedInUrl = url => {
 const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/
 return linkedinPattern.test(url)
}
const isYouTubeUrl = url => {
 const youtubePattern = /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/
 return youtubePattern.test(url)
}
const isTikTokUrl = (url) => {
   const tiktokPattern = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[^\/]+\/video\/\d+$/;
   return tiktokPattern.test(url);
 };
 
module.exports = {
 isTwiiterUrl,
 isFacebookUrl,
 isInstagramUrl,
 isLinkedInUrl,
 isYouTubeUrl,
 isTikTokUrl
}
