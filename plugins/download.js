const { Module, Scraper, mode } = require("../lib");
Module(
 {
  pattern: "insta",
  fromMe: mode,
  desc: "Downlaod post or reel from Instagram",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide instagram url");
  await message.sendReply("_downloading_");
  const ig = new Scraper();
  const buff = await ig.instagram(match);
  return await message.sendFile(buff);
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

Module(
 {
  pattern: "twitter",
  fromMe: mode,
  desc: "Download Twitter Videos & Images",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide twitter url_");
  await message.sendReply("_downloading_");
  const x = new Scraper();
  const buff = await x.twitter(match);
  return message.sendFile(buff);
 }
);
