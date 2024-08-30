const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/client");
const { getandRequirePlugins } = require("./lib/database/plugins");
const { exec } = require("child_process");
const { patch, MakeSession } = require("./lib");
global.__basedir = __dirname;
const process = require("./package.json").scripts.stop;
const parseDir = async (directory) => {
 try {
  const files = await fs.readdir(directory);
  return Promise.all(files.filter((file) => path.extname(file).toLowerCase() === ".js").map((file) => require(path.join(directory, file))));
 } catch (error) {
  console.error("Error reading and requiring files:", error);
  throw error;
 }
};

async function initialize() {
 try {
  await patch();
  await MakeSession();
  await parseDir(path.join(__dirname, "/lib/database/"));
  console.log("Syncing Database");

  await config.DATABASE.sync();

  await parseDir(path.join(__dirname, "/plugins/"));
  await getandRequirePlugins();
  console.log("External Modules Installed");

  return await connect();
 } catch (error) {
  console.error("Initialization error:", error);
  return exec(process);
 }
}

initialize();
