const { command, commands } = require("./plugins");
let config = require("../config");
const { getBuffer, decodeJid, parseJid, parsedJid, getJson, isIgUrl, isUrl, getUrl, qrcode, secondsToDHMS, IronMan, formatBytes, sleep, clockString, validateQuality, runtime, AddMp3Meta, Bitly, isNumber, getRandom, toAudio, readQr, getLyrics, isAdmin } = require("./functions");
const { serialize, downloadMedia } = require("./serialize");
const Greetings = require("./Greetings");
const { connect } = require("./client");
const fetchFiles = require("./modules");
const { getandRequirePlugins } = require("./database/plugins");
const makeSession = require("./session");
const { delay } = require("baileys");

module.exports = {
 connect,
 fetchFiles,
 getandRequirePlugins,
 makeSession,
 delay,
 toAudio,
 mode: config.WORK_TYPE.toLowerCase() === "private",
 Greetings,
 isAdmin,
 getLyrics,
 readQr,
 serialize,
 downloadMedia,
 getRandom,
 Function: command,
 command,
 commands,
 getBuffer,
 decodeJid,
 parseJid,
 parsedJid,
 getJson,
 isIgUrl,
 isUrl,
 getUrl,
 validateQuality,
 qrcode,
 secondsToDHMS,
 formatBytes,
 IronMan,
 sleep,
 clockString,
 runtime,
 AddMp3Meta,
 Bitly,
 isNumber,
};
