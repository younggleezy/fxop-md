const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");
const { getandRequirePlugins } = require("./lib/database/plugins");
global.__basedir = __dirname;

const parse = async directory => {
 try {
  const files = await fs.readdir(directory);
  const jsFiles = files.filter(file => path.extname(file).toLowerCase() === ".js");

  const results = await Promise.allSettled(
   jsFiles.map(async file => {
    try {
     return { file, module: require(path.join(directory, file)), error: null };
    } catch (error) {
     return { file, module: null, error: error.message };
    }
   })
  );

  results.forEach(({ status, value }) => {
   if (status === "rejected") {
    console.error(`Error loading file: ${value.file}\n`, value.error);
   }
  });

  return results.filter(({ status }) => status === "fulfilled").map(({ value }) => value.module);
 } catch (error) {
  console.error("Error reading files from directory:", error.message);
  throw error;
 }
};

async function initialize() {
 try {
  await parse(path.join(__dirname, "/lib/database/"));
  console.log("Syncing Database");
  await config.DATABASE.sync();
  await parse(path.join(__dirname, "/plugins/"));
  await getandRequirePlugins();
  console.log("External Modules Installed");
  return await connect();
 } catch (error) {
  console.error("Initialization error:", error);
  return process.exit(1);
 }
}

initialize();
