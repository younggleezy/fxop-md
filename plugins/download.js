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

Module(
 {
  pattern: "pinterest",
  fromMe: mode,
  desc: "Downloads Pinterest Images",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide me words_");
  await message.sendReply("_processing_");
  const pint = new Scraper();
  const buff = await pint.pinterest(match);
  return message.sendFile(buff);
 }
);

Module(
 {
  pattern: "tiktok",
  fromMe: mode,
  desc: "Downloads Tiktok Videos & Images",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide tiktok url_");
  await message.sendReply("_downloading_");
  const tik = new Scraper();
  const buff = await tik.tiktok(match);
  return message.sendFile(buff);
 }
);

Module(
 {
  pattern: "ytv",
  fromMe: mode,
  desc: "Downloads Youtube Videos",
  type: "downlaoder",
 },
 async (message, match) => {
  if (!match) return await message.sendReply("_provide youtube video url_");
  await message.sendReply("_downloading_");
  const yts = new Scraper();
  const buff = await yts.youtube(match);
  return message.sendFile(buff);
 }
);

Module(
 {
  pattern: "yta",
  fromMe: mode,
  desc: "Downloads Youtube Music",
  type: "downloader",
 },
 async (message, match) => {
  if (!match) return message.sendReply("_provide youtube music url_");
  await message.sendReply("_downloading_");
  const ytsa = new Scraper();
  const buff = await ytsa.youtubeMp3(match);
  return message.sendFile(buff);
 }
);
