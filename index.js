const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/client");
const io = require("socket.io-client");
const {getandRequirePlugins} = require("./lib/database/plugins");

global.__basedir = __dirname;

const readAndRequireFiles = async directory => {
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
  await readAndRequireFiles(path.join(__dirname, "/lib/database/"));
  console.log("Syncing Database");

  await config.DATABASE.sync();
  await readAndRequireFiles(path.join(__dirname, "/plugins/"));
  await getandRequirePlugins();
  console.log("✅ Plugins Installed!");
  const ws = io("https://socket.xasena.me/", {
   reconnection: true
  });
  ws.on("connect", () => console.log("Connected to server"));
  ws.on("disconnect", () => console.log("Disconnected from server"));
  return await connect();
 } catch (error) {
  console.error("Initialization error:", error);
  return process.exit(1); // Exit with error status
 }
}

initialize();
