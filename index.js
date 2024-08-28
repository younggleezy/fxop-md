const path = require("path");
const config = require("./config");
const express = require("express");
const app = express();
const { connect, fetchFiles, getandRequirePlugins, makeSession, delay } = require("./lib");
global.__basedir = __dirname;

app.get("/", (req, res) => {
 res.send("Bot Connected");
});

const server = app.listen(8000, () => {
 console.log("Server is running on http://localhost:8000");
 runBot();
});

async function runBot() {
 try {
  await fetchFiles(path.join(__dirname, "/lib/database/"));
  console.log("Syncing Database");
  await delay(3000);
  await config.DATABASE.sync();
  await fetchFiles(path.join(__dirname, "/plugins/"));
  await getandRequirePlugins();
  console.log("External Modules Installed");
  await makeSession();
  return await connect();
 } catch (error) {
  console.error("Initialization error:", error);
  process.exit(1);
 }
}
