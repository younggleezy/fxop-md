const fs = require("fs").promises;
const axios = require("axios");
const atob = require("atob");
const config = require("../config");
let cc = config.SESSION_ID.replace(/^SESSION_\d{2}_\d{2}_\d{2}_\d{2}_/, "")
 .replace(/Session;;;/gi, "")
 .trim();

let baileys = "../session/";
async function makeSession() {
 if (cc && cc.length > 3 && cc.length < 30) {
  try {
   const { data } = await axios.get(`https://paste.c-net.org/${cc}`);
   await fs.writeFile(__dirname + baileys + "creds.json", atob(data), "utf8");
  } catch (error) {
   console.log("\nERROR GETTING SESSION FROM PASTE SERVER\n");
  }
 } else if (cc) {
  try {
   console.log("\nConnecting To Session...");
   const decodedSession = atob(cc);
   if (decodedSession && decodedSession.length > 5) {
    await fs.writeFile(__dirname + baileys + "creds.json", decodedSession, "utf8");
   }
  } catch (error) {
   console.log("EMPTY SESSION ERROR FROM SERVER\nPLEASE SCAN THE QR AGAIN");
  }
 }
}

module.exports = makeSession;
