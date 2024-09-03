const { command } = require("../lib");
const { editAudio } = require("../lib");
async function effectAudio(message, effectName) {
 try {
  return await editAudio(message, effectName, message);
 } catch (error) {
  return await message.log(error);
 }
}

command(
 {
  pattern: "bass",
  info: "adds bass in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "blown",
  info: "adds blown in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "deep",
  info: "adds deep in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "earrape",
  info: "adds earrape in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "fast",
  info: "adds fast in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "fat",
  info: "adds fat in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "nightcore",
  info: "adds nightcore in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "reverse",
  info: "adds reverse in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "robot",
  info: "adds robot in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "slow",
  info: "adds slow in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "smooth",
  info: "adds smooth in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);

command(
 {
  pattern: "tupai",
  info: "adds tupai in given sound",
  type: "audio",
 },
 async (message, match) => {
  return await effectAudio(message, match);
 }
);
