command(
 {
  on: "text",
  fromMe: true,
  dontAddCommandList: true,
 },
 async (message, match) => {
  if (message.message.startsWith("$") || message.message.startsWith(">")) {
   const code = message.message.slice(1).trim();

   try {
    const result = eval(code);
    const output = typeof result === "string" ? result : JSON.stringify(result, null, 2);
    await message.reply(`Execution Result:\n\`\`\`\n${output}\n\`\`\``);
   } catch (error) {
    await message.reply(`Error:\n\`\`\`\n${error.message}\n\`\`\``);
   }
  }
 }
);
