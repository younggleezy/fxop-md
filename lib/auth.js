const fs = require("fs");
const path = require("path");
const { SESSION_ID } = require("../config");
const sessionPath = path.resolve(__dirname, "../session");
if (!fs.existsSync(sessionPath)) {
 fs.mkdirSync(sessionPath, { recursive: true });
}
async function writeSession(sessionId = SESSION_ID, sessionPath = path.resolve(__dirname, "../session")) {
 let cleanedSessionId = ("" + sessionId).replace(/Session~/gi, "").trim();

 function decodeBase64(encodedString) {
  return Buffer.from(encodedString, "base64").toString("utf-8");
 }

 if (cleanedSessionId) {
  try {
   const decodedSession = decodeBase64(cleanedSessionId);
   const parsedSession = JSON.parse(decodedSession);
   if (parsedSession["creds.json"]) {
    for (const fileName in parsedSession) {
     try {
      const fileData = typeof parsedSession[fileName] === "string" ? parsedSession[fileName] : JSON.stringify(parsedSession[fileName], null, 2);
      fs.writeFileSync(`${sessionPath}/${fileName}`, fileData);
     } catch (err) {
      console.error(`Error writing file: ${fileName}`, err);
     }
     console.log("session connected");
    }
   } else {
    fs.writeFileSync(`${sessionPath}/creds.json`, JSON.stringify(parsedSession, null, 2));
   }
  } catch (error) {
   console.log("INVAILD SESSION ID:", error);
  }
 }
}
module.exports = writeSession;
