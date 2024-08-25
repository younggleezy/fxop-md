const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/client.js");
const {fetchFiles}=require('./lib')
const { getandRequirePlugins } = require("./lib/database/plugins");
const {existsSync, mkdirSync} = require('fs')
global.__basedir = __dirname;

async function runBot() {
  try {
    await fetchFiles(path.join(__dirname, "/lib/database/"));
    console.log("Syncing Database");

    await config.DATABASE.sync();

    console.log("⬇  Installing Plugins...");
    await fetchFiles(path.join(__dirname, "/plugins/"));
    await getandRequirePlugins();
    console.log("✅ Plugins Installed!");
    return await connect();
  } catch (error) {
    console.error("Initialization error:", error);
    return process.exit(1);
  }
}

runBot();
