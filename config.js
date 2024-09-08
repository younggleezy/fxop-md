const { Sequelize } = require("sequelize");
require("dotenv").config();
const toBool = x => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./database.db";
module.exports = {
   SESSION_ID: process.env.SESSION_ID || "",
   HANDLERS: process.env.HANDLER === "false" || process.env.HANDLER === "null" ? "^" : "[.]",
   BOT_INFO: process.env.BOT_INFO || "ᴀsᴛʀᴏ;ғxᴏᴘ-ᴍᴅ", //YourName;BotName;Image/VideoLink
   SUDO: process.env.SUDO || "2348039607375,2349162411207,4915252819677",
   ANTICALL: process.env.ANTICALL || false,
   PPRESENCE: process.env.PRESENCE || "available", // "unavailable", "available", "composing", "recording", "paused"
   TIME_ZONE: process.env.TIME_ZONE || "Africa/Lagos",
   LOGS: toBool(process.env.LOGS) || true,
   ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
   BRANCH: "master",
   WARN_COUNT: 3,
   AUTHOR: process.env.AUTHOR || "ғxᴏᴘ-ᴍᴅ",
   ANTIWORDS: process.env.ANTIWORDS || "badword1,badword2,badword3",
   PACKNAME: process.env.PACKNAME || "ғxᴏᴘ-ᴍᴅ",
   WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
   GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
   ANTILINK: toBool(process.env.ANTI_LINK) || false,
   HEROKU: toBool(process.env.HEROKU) || false,
   AUTO_READ: toBool(process.env.AUTO_READ) || false,
   RMBG_KEY: process.env.RMBG_KEY || "",
   AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
   WORK_TYPE: process.env.WORK_TYPE || "private",
   DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
   DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
   REMOVEBG: process.env.REMOVEBG || "",
   DATABASE_URL: DATABASE_URL,
   STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
   HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
   HEROKU_API_KEY: process.env.HEROKU_API_KEY,
   DATABASE:
      DATABASE_URL === "./database.db"
         ? new Sequelize({
              dialect: "sqlite",
              storage: DATABASE_URL,
              logging: false,
           })
         : new Sequelize(DATABASE_URL, {
              dialect: "postgres",
              ssl: true,
              protocol: "postgres",
              dialectOptions: {
                 native: true,
                 ssl: { require: true, rejectUnauthorized: false },
              },
              logging: false,
           }),
};
