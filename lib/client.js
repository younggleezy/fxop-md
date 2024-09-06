const pino = require("pino");
const path = require("path");
const fs = require("fs");
const plugins = require("./plugins");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("baileys");
const { PausedChats } = require("./database");
const { getAntiLink } = require("./database/antilink");
const config = require("../config");
const { serialize } = require("./serialize");
const { Greetings } = require("./Greetings");
const { Image, Message, Sticker, Video, AllMessage } = require("./Messages");
const {
  loadMessage,
  saveMessage,
  saveChat,
  getName,
} = require("./database/StoreDb");

const logger = pino({ level: "silent" });
const connect = async () => {
  const sessionDir = "./session";
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__basedir, sessionDir),
  );
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: false,
    logger,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    emitOwnEvents: false,
    version,
    getMessage: async (key) =>
      (loadMessage(key.id) || {}).message || { conversation: null },
  });

  conn.ev.on("connection.update", handleConnectionUpdate(conn));
  conn.ev.on("creds.update", saveCreds);
  conn.ev.on("group-participants.update", async (data) =>
    Greetings(data, conn),
  );
  conn.ev.on("chats.update", async (chats) =>
    chats.forEach(async (chat) => await saveChat(chat)),
  );
  conn.ev.on("messages.upsert", handleMessages(conn));

  const sentErrors = new Set();

  function logError(err) {
    const errorMessage = err.stack || err.toString();
    const errorLines = errorMessage.split("\n");
    const importantError = errorLines[0];
    const fileInfo = errorLines.find((line) => {
      return line.includes(process.cwd()) && !line.includes("node_modules");
    });

    const fileName = fileInfo
      ? path.basename(fileInfo.trim().split("(")[1].split(":")[0])
      : "Unknown";

    const errorKey = `${fileName}:${importantError}`;

    if (!sentErrors.has(errorKey)) {
      const text = `\`\`\`Error in ${fileName}:\n${importantError}\`\`\``;

      console.error(text);

      if (
        typeof conn !== "undefined" &&
        conn.sendMessage &&
        conn.user &&
        conn.user.id &&
        !fileName.includes("Node_Modules") &&
        !fileName.toLowerCase().includes("node_modules")
      ) {
        conn.sendMessage(conn.user.id, { text }).catch(console.error);
        sentErrors.add(errorKey);
      }
    } else {
      console.log(`Duplicate error suppressed: ${errorKey}`);
    }
  }

  const loggedErrors = new Set();

  process.on("unhandledRejection", (err) => {
    if (!loggedErrors.has(err)) {
      loggedErrors.add(err);
      logError(err);
    }
  });

  process.on("uncaughtException", (err) => {
    if (!loggedErrors.has(err)) {
      loggedErrors.add(err);
      logError(err);
    }
  });
  return conn;
};

const handleConnectionUpdate = (conn) => async (s) => {
  const { connection, lastDisconnect } = s;
  if (connection === "connecting");
  else if (connection === "open") {
    console.log("Connected");
    const packageVersion = require("../package.json").version;
    const totalPlugins = plugins.commands.length;
    const workType = config.WORK_TYPE;
    const str = `\`\`\`Bot Connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``;
    conn.sendMessage(conn.user.id, { text: str });
  } else if (connection === "close") {
    if (
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
    ) {
      connect();
      console.log("Reconnecting...");
    } else {
      console.log("Connection closed. Device logged out.");
      await delay(3000);
      process.exit(0);
    }
  }
};

exports.mode = config.WORK_TYPE === "public" ? false : true;

const shouldExecuteCommand = (command, msg) => {
  const isPublicMode = config.WORK_TYPE === "public";
  const isSudoOrOwner = msg.sudo || msg.key.fromMe;

  if (isPublicMode && command.fromMe !== true) {
    return true;
  }
  return isSudoOrOwner;
};

const URL_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const handleGroupMessage = async (conn, msg) => {
  if (!msg.isGroup) return;

  const antilink = await getAntiLink(msg.from);
  if (!antilink || !antilink.enabled) return;

  const containsUrl = URL_PATTERN.test(msg.body);

  if (containsUrl) {
    try {
      const isAdmin = await isGroupAdmin(conn, msg.from, msg.sender);
      const urlsInMessage = msg.body.match(URL_PATTERN);
      const isAllowedUrl = urlsInMessage.every((url) =>
        isUrlAllowed(url, antilink.allowedUrls),
      );

      if (!isAllowedUrl) {
        if (isAdmin) {
          await conn.sendMessage(msg.from, {
            text: "Warning: As an admin, please be cautious when sharing URLs.",
          });
        } else {
          switch (antilink.action) {
            case "warn":
              await warnUser(conn, msg);
              break;
            case "kick":
              await kickUser(conn, msg.from, msg.sender);
              break;
            case "null":
              break;
          }
          await deleteMessage(conn, msg);
        }
      }
    } catch (error) {
      console.error("Error in handleGroupMessage:", error);
    }
  }
};

const isGroupAdmin = async (conn, groupId, userId) => {
  try {
    const groupMetadata = await conn.groupMetadata(groupId);
    const groupAdmins = groupMetadata.participants
      .filter((p) => p.admin)
      .map((p) => p.id);
    return groupAdmins.includes(userId);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

const isUrlAllowed = (url, allowedUrls) => {
  if (!allowedUrls) return false;
  const allowList = allowedUrls.split(",").filter((u) => !u.startsWith("!"));
  const blockList = allowedUrls
    .split(",")
    .filter((u) => u.startsWith("!"))
    .map((u) => u.slice(1));

  return (
    allowList.some((allowedUrl) => url.includes(allowedUrl)) &&
    !blockList.some((blockedUrl) => url.includes(blockedUrl))
  );
};

const deleteMessage = async (conn, msg) => {
  try {
    await conn.sendMessage(msg.from, {
      delete: msg.key,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

const warnUser = async (conn, msg) => {
  try {
    await conn.sendMessage(msg.from, {
      text: `@${msg.sender.split("@")[0]}, sending links is not allowed in this group.`,
      mentions: [msg.sender],
    });
  } catch (error) {
    console.error("Error warning user:", error);
  }
};

const kickUser = async (conn, groupId, userId) => {
  try {
    await conn.groupParticipantsUpdate(groupId, [userId], "remove");
    console.log(`User ${userId} kicked from group ${groupId}`);
  } catch (error) {
    console.error(
      `Failed to kick user ${userId} from group ${groupId}:`,
      error,
    );
  }
};

const handleMessages = (conn) => async (m) => {
  if (m.type !== "notify") return;
  let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
  await saveMessage(m.messages[0], msg.sender);
  if (config.AUTO_READ) await conn.readMessages(msg.key);
  if (config.AUTO_STATUS_READ && msg.from === "status@broadcast")
    await conn.readMessages(msg.key);

  let text_msg = msg.body;
  if (!msg) return;

  const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
  const isResume = regex.test(text_msg);
  const chatId = msg.from;
  const pausedChats = await PausedChats.getPausedChats();

  if (
    pausedChats.some((pausedChat) => pausedChat.chatId === chatId && !isResume)
  )
    return;

  if (msg.isGroup) {
    await handleGroupMessage(conn, msg);
  }
  if (config.LOGS && msg) {
    const name = await getName(msg.sender);
    const isGroup = msg.from.endsWith("@g.us");
    const messageContent = text_msg || msg.type;

    if (messageContent !== undefined) {
      if (isGroup) {
        const groupName = (await conn.groupMetadata(msg.from)).subject;
        console.log(`${groupName}:\n${name}: ${messageContent}`);
      } else {
        console.log(`${name}: ${messageContent}`);
      }
    }
  }
  var whats;
  plugins.commands.map(async (command) => {
    if (!shouldExecuteCommand(command, msg)) return;

    const handleCommand = (Instance, args) => {
      whats = new Instance(conn, msg);
      command.function(whats, ...args, msg, conn, m);
    };

    if (text_msg && command.pattern) {
      let iscommand = text_msg.match(command.pattern);
      if (iscommand) {
        let [, prefix, , match] = iscommand;
        match = match ? match : false;
        msg.prefix = prefix;
        msg.command = [prefix, iscommand[2]].join("");
        handleCommand(Message, [match]);
      }
    } else {
      switch (command.on) {
        case "text":
          if (text_msg) handleCommand(Message, [text_msg]);
          break;
        case "image":
          if (msg.type === "imageMessage") handleCommand(Image, [text_msg]);
          break;
        case "sticker":
          if (msg.type === "stickerMessage") handleCommand(Sticker, []);
          break;
        case "video":
          if (msg.type === "videoMessage") handleCommand(Video, []);
          break;
        case "delete":
          if (msg.type === "protocolMessage") {
            whats = new Message(conn, msg);
            whats.messageId = msg.message.protocolMessage.key?.id;
            command.function(whats, msg, conn, m);
          }
          break;
        case "message":
          handleCommand(AllMessage, []);
          break;
        default:
          break;
      }
    }
  });
};

module.exports = { connect };
