const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");
async function getUrl(input) {
   return new Promise(async (resolve, reject) => {
      try {
         const form = new FormData();

         if (Buffer.isBuffer(input)) {
            const fileType = await fromBuffer(input);
            form.append("file", input, {
               filename: `file.${fileType.ext}`,
               contentType: fileType.mime,
            });
         } else if (typeof input === "string") {
            if (!fs.existsSync(input)) {
               return reject(new Error("File not Found"));
            }
            form.append("file", fs.createReadStream(input));
         } else {
            return reject(new Error("Invalid input. Expected Buffer or file path."));
         }

         const { data } = await axios({
            url: "https://graph.org/upload",
            method: "POST",
            headers: {
               ...form.getHeaders(),
            },
            data: form,
         });

         resolve("https://graph.org" + data[0].src);
      } catch (err) {
         reject(new Error(String(err)));
      }
   });
}

module.exports = { getUrl };
