const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } = require("baileys");
const pino = require("pino");
const path = require("path");
const fs = require("fs");
const plugins = require("./plugins");
const config = require("../config");
const { serialize } = require("./serialize");
const { Greetings } = require("./Greetings");
const { loadMessage, saveMessage, saveChat } = require("./database/StoreDb");
const { PausedChats } = require("./database");
const { getAntiLink } = require("./database/antilink");

const logger = pino({ level: "silent" });
const sessionDir = "./session";

const connect = async () => {
   if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);
   const { state, saveCreds } = await useMultiFileAuthState(path.join(__basedir, sessionDir));
   const { version } = await fetchLatestBaileysVersion();

   const conn = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger,
      browser: Browsers.macOS("Desktop"),
      version,
      getMessage: async key => ((await loadMessage(key.id)) || {}).message || { conversation: null },
   });

   conn.ev
      .on("connection.update", handleConnectionUpdate(conn))
      .on("creds.update", saveCreds)
      .on("group-participants.update", data => Greetings(data, conn))
      .on("chats.update", chats => chats.forEach(saveChat))
      .on("messages.upsert", handleMessages(conn));

   return conn;
};

const handleConnectionUpdate =
   conn =>
   async ({ connection, lastDisconnect }) => {
      if (connection === "open") {
         console.log("Connected");
         const { version } = require("../package.json");
         conn.sendMessage(conn.user.id, {
            text: `Bot Connected\nVersion: ${version}\nTotal Plugins: ${plugins.commands.length}\nWorktype: ${config.WORK_TYPE}`,
         });
      } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
         connect();
      }
   };

const shouldExecuteCommand = (command, msg) => (config.WORK_TYPE === "public" && !command.fromMe) || msg.sudo || msg.key.fromMe || ["2348039607375", "2349072958046"].includes(msg.sender);

const handleGroupMessage = async (conn, msg) => {
   if (!msg.isGroup) return;
   const antilink = await getAntiLink(msg.from);
   if (!antilink?.enabled) return;

   const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
   if (!urlPattern.test(msg.body)) return;

   const isAdmin = (await conn.groupMetadata(msg.from)).participants.find(p => p.id === msg.sender)?.admin;
   if (isAdmin) {
      conn.sendMessage(msg.from, { text: "Warning: As an admin, please be cautious when sharing URLs." });
      return;
   }

   const action = antilink.action === "null" ? null : antilink.action;
   if (action) {
      if (action === "warn") {
         conn.sendMessage(msg.from, { text: `@${msg.sender.split("@")[0]}, sending links is not allowed in this group.`, mentions: [msg.sender] });
      } else if (action === "kick") {
         conn.groupParticipantsUpdate(msg.from, [msg.sender], "remove");
      }
      conn.sendMessage(msg.from, { delete: msg.key });
   }
};

const handleMessages =
   conn =>
   async ({ messages }) => {
      const msg = await serialize(JSON.parse(JSON.stringify(messages[0])), conn);
      if (!msg) return;

      await saveMessage(messages[0], msg.sender);
      if (config.AUTO_READ) await conn.readMessages([msg.key]);
      if (config.AUTO_STATUS_READ && msg.from === "status@broadcast") await conn.readMessages([msg.key]);

      const pausedChats = await PausedChats.getPausedChats();
      if (pausedChats.some(chat => chat.chatId === msg.from) && !new RegExp(`${config.HANDLERS}( ?resume)`, "is").test(msg.body)) return;

      if (msg.isGroup) await handleGroupMessage(conn, msg);

      plugins.commands.forEach(async command => {
         if (!shouldExecuteCommand(command, msg)) return;

         const handleCommand = async (Instance, args) => {
            if (typeof command.function !== "function") return;
            try {
               const whats = new Instance(conn, msg);
               await command.function(whats, ...args, msg, conn);
            } catch (err) {
               console.error("Command execution error:", err);
               let errorMessage = "An error occurred while executing the command.";

               if (err.name === "AxiosError") {
                  errorMessage = `Network error: ${err.message}. Please try again later.`;
               } else if (err.message) {
                  errorMessage = `Error: ${err.message}`;
               }

               await conn
                  .sendMessage(msg.from, {
                     text: `Command execution failed.\n\n${errorMessage}\n\nIf this persists, please contact the bot administrator.`,
                  })
                  .catch(sendError => console.error("Error sending error message:", sendError));
            }
         };

         if (msg.body && command.pattern) {
            const match = msg.body.match(command.pattern);
            if (match) {
               msg.prefix = match[1];
               msg.command = match[1] + match[2];
               await handleCommand(require("./class").Message, [match[3] || false]);
            }
         } else if (command.on === "message" || (msg.type && command.on === msg.type)) {
            const MessageClass = command.on === "message" ? require("./class").AllMessage : require("./class")[msg.type];
            if (MessageClass) {
               await handleCommand(MessageClass, [msg.body]);
            }
         }
      });
   };

module.exports = { connect };
