const { Sequelize } = require('sequelize')
require('dotenv').config()
const toBool = x => x === 'true'
const DATABASE_URL = process.env.DATABASE_URL || './database.db'
module.exports = {
 SESSION_ID: process.env.SESSION_ID || null,
 BOT_INFO: process.env.BOT_INFO || 'Astro,FXOP-MD',
 SUDO: process.env.SUDO || '2348039607375,2349027862116',
 HANDLERS: process.env.HANDLER || '.',
 ANTILINK_ACTION: process.env.ANTI_LINK || 'kick',
 LANG: process.env.LANG || 'EN',
 BRANCH: 'master',
 WARN_COUNT: 3,
 PACKNAME: process.env.PACKNAME || 'FXOP-MD',
 WELCOME_MSG: process.env.WELCOME_MSG || 'Hi @user Welcome to @gname',
 GOODBYE_MSG: process.env.GOODBYE_MSG || 'Hi @user It was Nice Seeing you',
 AUTHOR: process.env.AUTHOR || 'Astro',
 HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
 HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
 HEROKU: toBool(process.env.HEROKU) || false,
 AUTO_READ: toBool(process.env.AUTO_READ) || false,
 AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
 ANTILINK: toBool(process.env.ANTI_LINK) || false,
 LOGS: toBool(process.env.LOGS) || true,
 RMBG_KEY: process.env.RMBG_KEY || false,
 DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
 DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
 REMOVEBG: process.env.REMOVEBG || false,
 DATABASE_URL: DATABASE_URL,
 STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
 WORK_TYPE: process.env.WORK_TYPE || 'private',
 PROCESSNAME: process.env.PROCESSNAME || 'fxop-md',
 DATABASE:
  DATABASE_URL === './database.db'
   ? new Sequelize({
      dialect: 'sqlite',
      storage: DATABASE_URL,
      logging: false,
     })
   : new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      ssl: true,
      protocol: 'postgres',
      dialectOptions: {
       native: true,
       ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
     }),
}
