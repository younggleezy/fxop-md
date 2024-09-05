const { command, mode, isAdmin } = require("../lib/");
const { addAntiWord, removeAntiWord, getAntiWords } = require("../lib/database/antiword");

command(
 {
  pattern: "antiword ?(.*)",
  fromMe: mode,
  desc: "Manage antiword settings",
  type: "group",
 },
 async (message, match) => {
  if (!message.isGroup) return await message.reply("_This command is for groups only_");
  if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

  const [action, ...words] = match[1].split(" ");
  const word = words.join(" ");

  switch (action.toLowerCase()) {
   case "add":
    if (!word) return await message.reply("_Please provide a word to add_");
    await addAntiWord(message.jid, word);
    return await message.reply(`_Added "${word}" to antiword list_`);

   case "remove":
    if (!word) return await message.reply("_Please provide a word to remove_");
    await removeAntiWord(message.jid, word);
    return await message.reply(`_Removed "${word}" from antiword list_`);

   case "list":
    const antiWords = await getAntiWords(message.jid);
    if (antiWords.length === 0) return await message.reply("_No words in antiword list_");
    return await message.reply(`_Antiwords: ${antiWords.join(", ")}_`);

   default:
    return await message.reply("_Invalid action. Use 'add', 'remove', or 'list'_");
  }
 }
);
