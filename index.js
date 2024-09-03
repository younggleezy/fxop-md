const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const config = require("./config");
const { connect, writeSession, patch } = require("./lib");
const { getandRequirePlugins } = require("./lib/database/plugins");
global.__basedir = __dirname;

const parseDir = async directory => {
 try {
  const files = await fs.readdir(directory);
  return Promise.all(files.filter(file => path.extname(file).toLowerCase() === ".js").map(file => require(path.join(directory, file))));
 } catch (error) {
  console.error("Error reading and requiring files:", error);
  throw error;
 }
};

async function initialize() {
 try {
  // await patch();
  await writeSession();
  await parseDir(path.join(__dirname, "/lib/database/"));
  console.log("Syncing Database");
  await config.DATABASE.sync();
  await parseDir(path.join(__dirname, "/plugins/"));
  await getandRequirePlugins();
  console.log("External Modules Installed");
  return await connect();
 } catch (error) {
  console.error("Initialization error:", error);
  return process.exit(1);
 }
}

async function startServer() {
 const app = express();
 const port = process.env.PORT || 3000;

 app.get("/", (req, res) => {
  res.send("Bot Running");
 });

 app.listen(port, () => {});
}

async function tempDir() {
 await fs.mkdir("temp");
}

async function main() {
 await initialize();
 await startServer();
 await tempDir();
}

main();
