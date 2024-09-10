const { SESSION_ID } = require("../config");
const PastebinAPI = require("pastebin-js");
const { exec } = require("child_process");
const useCustomAuthState = require("./database/authstate");

const pastebin = new PastebinAPI("bR1GcMw175fegaIFV2PfignYVtF0b_Bl");

function decodeB64(str) {
   return Buffer.from(str, "base64").toString("utf-8");
}

async function writeToAuth(key, value) {
   await useCustomAuthState.upsert({
      key,
      value: JSON.stringify(value),
   });
}

async function writeSession(sid = SESSION_ID) {
   const sessId = ("" + sid).replace(/Session~/gi, "").trim();

   if (sessId.length > 20) {
      const decoded = decodeB64(sessId);
      if (!decoded) {
         console.error("session error");
         exec("npm stop");
         return;
      }
      const parsed = JSON.parse(decoded);

      if (parsed["creds.json"]) {
         for (const [fname, fdata] of Object.entries(parsed)) {
            await writeToAuth(fname, fdata);
         }
      } else {
         await writeToAuth("creds.json", parsed);
      }
   } else {
      const decodedData = await pastebin.getPaste(sessId).catch(() => {
         console.error("invalid session id");
         exec("npm stop");
         return;
      });

      if (decodedData) {
         await writeToAuth("creds.json", JSON.parse(decodedData.toString()));
      }
   }
   console.log("\x1b[1m%s\x1b[0m", "session connected");
}

module.exports = { writeSession };
