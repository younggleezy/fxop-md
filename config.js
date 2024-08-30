const {Sequelize} = require("sequelize");
const fs = require("fs");
require("dotenv").config();
const toBool = x => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./database.db";
module.exports = {
 ANTILINK: toBool(process.env.ANTI_LINK) || false,
 LOGS: toBool(process.env.LOGS) || true,
 ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
 SESSION_ID: process.env.SESSION_ID || "",
 LANG: process.env.LANG || "EN",
 AUTH_TOKEN: "",
 HANDLERS: process.env.HANDLER || ".",
 RMBG_KEY: process.env.RMBG_KEY || false,
 BRANCH: "main",
 WARN_COUNT: 3,
 PACKNAME: process.env.PACKNAME || "fxop",
 WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
 GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
 AUTHOR: process.env.AUTHOR || "X-Electra",
 SUDO: process.env.SUDO || "2348039607375,2349067862116,4915252819677",
 HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
 HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
 OWNER_NAME: process.env.OWNER_NAME || "Astro",
 HEROKU: toBool(process.env.HEROKU) || false,
 BOT_NAME: process.env.BOT_NAME || "fxop",
 AUTO_READ: toBool(process.env.AUTO_READ) || false,
 AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
 PROCESSNAME: process.env.PROCESSNAME || "fxop",
 WORK_TYPE: process.env.WORK_TYPE || "private",
 SESSION_URL: process.env.SESSION_URL || "",
 DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
 DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
 REMOVEBG: process.env.REMOVEBG || false,
 DATABASE_URL: DATABASE_URL,
 STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
 DATABASE:
  DATABASE_URL === "./database.db"
   ? new Sequelize({
      dialect: "sqlite",
      storage: DATABASE_URL,
      logging: false
     })
   : new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      ssl: true,
      protocol: "postgres",
      dialectOptions: {
       native: true,
       ssl: {
        require: true,
        rejectUnauthorized: false
       }
      },
      logging: false
     })
};