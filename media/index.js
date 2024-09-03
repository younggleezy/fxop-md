const fs = require("fs-extra");
const path = require("path");

async function buffThumb(filePath) {
 console.log("buffThumb called with:", filePath);

 try {
  const absolutePath = path.resolve(process.cwd(), filePath);
  console.log("Absolute path:", absolutePath);

  if (!(await fs.pathExists(absolutePath))) {
   console.error("File does not exist:", absolutePath);
   throw new Error("File not found");
  }

  const buffer = await fs.readFile(absolutePath);
  console.log("File read successfully, buffer length:", buffer.length);
  return buffer;
 } catch (error) {
  console.error("Error in buffThumb:", error);
  throw error;
 }
}

module.exports = { buffThumb };
