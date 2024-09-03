const fs = require("fs");
const path = require("path");

/**
 * Function to read a file from a given path and return its content as a buffer.
 * @param {string} relativePath - The relative path to the file.
 * @returns {Promise<Buffer>} - A promise that resolves with the file buffer.
 */
const buffThumb = async relativePath => {
 try {
  const filePath = path.join(__dirname, relativePath);
  const fileBuffer = await fs.promises.readFile(filePath);
  return fileBuffer;
 } catch (error) {
  console.error(`Error reading file from path: ${relativePath}`, error);
  throw error;
 }
};
module.exports = { buffThumb };
