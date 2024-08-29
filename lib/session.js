const fs = require("fs").promises;
const axios = require("axios");
const atob = require("atob");
const config = require("../config");
let sessionID = config.SESSION_ID.trim();

let sessionPath = "../session/";
async function makeSession() {
 if (sessionID) {
  try {
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
