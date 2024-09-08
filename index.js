const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const config = require("./config");
const { connect, writeSession, patch, parseDir } = require("./lib");
const { getandRequirePlugins } = require("./lib/database/plugins");

class BotSystem {
   constructor() {
      global.__basedir = __dirname;
      this.app = express();
      this.port = process.env.PORT || 3000;
   }

   async initialize() {
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

   async startServer() {
      this.app.get("/", (req, res) => {
         res.send("Bot Running");
      });

      this.app.listen(this.port, () => {});
   }

   async tempDir() {
      const dir = path.join(__dirname, "temp");
      try {
         await fs.access(dir);
      } catch (err) {
         if (err.code === "ENOENT") {
            await fs.mkdir(dir, { recursive: true });
         }
      }
   }

   async createGitignore() {
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

   async main() {
      try {
         await this.initialize();
         await this.startServer();
         await this.tempDir();
         await this.createGitignore();
      } catch (error) {
         console.warn("BOT SYSTEM FAILED");
      }
   }
}

const botSystem = new BotSystem();
botSystem.main();
