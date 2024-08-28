const fs = require("fs").promises;
const axios = require("axios");
const atob = require("atob");
const config = require("../config");
let sessionID = config.SESSION_ID.trim();

let sessionPath = "../session/";
async function makeSession() {
 if (sessionID && sessionID.length > 3 && sessionID.length < 30) {
  try {
   const { data } = await axios.get(`https://paste.c-net.org/${sessionID}`);
   await fs.writeFile(__dirname + sessionPath + "creds.json", atob(data), "utf8");
  } catch (error) {
   console.log("\nNO SESSION FROM API\n");
  }
 } else if (sessionID) {
  try {
   console.log("\nConnecting To Session...");
   const decodedSession = atob(sessionID);
   if (decodedSession && decodedSession.length > 5) {
    await fs.writeFile(__dirname + sessionPath + "creds.json", decodedSession, "utf8");
   }
  } catch (error) {
   console.error("NO SESSION FOUND");
  }
 }
}

module.exports = makeSession;
