const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const config = require("./config");
const { connect, writeSession, patch, parseDir } = require("./lib");
const { getandRequirePlugins } = require("./lib/database/plugins");
global.__basedir = __dirname;

async function initialize() {
   try {
      await patch();
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
   const dir = path.join(__dirname, "temp");
   try {
      await fs.access(dir);
   } catch (err) {
      if (err.code === "ENOENT") {
         await fs.mkdir(dir, { recursive: true });
      }
   }
}

async function createGitignore() {
   const content = `node_modules
.gitignore
session
.env
package-lock.json
database.db`;

   fs.writeFile(".gitignore", content, err => {
      if (err) {
         console.error("Error creating .gitignore file:", err);
      } else {
         console.log(".gitignore file created successfully!");
      }
   });
}

async function main() {
   try {
      await initialize();
      await startServer();
      await tempDir();
      await createGitignore();
   } catch (error) {
      console.warn("BOT SYSTEM FAILED");
   }
}

main();
