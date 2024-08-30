const { Module, mode } = require("../lib/");
const { inspect } = require("util");

Module({
  on: "message",
  fromMe: mode,
  dontAddCommandList: true,
}, async (message, match) => {
  if (!message.isBaileys) return;
  
  const prefix = message.body.startsWith(">") ? ">" : message.body.startsWith("$") ? "$" : null;
  if (!prefix) return;

  const code = message.body.substring(1).trim(); // Extract the code to evaluate

  if (!code) {
    await message.reply("No code provided for evaluation.");
    return;
  }

  try {
    const result = await evalCode(code);
    await message.reply(`**Result:**\n\`\`\`js\n${inspect(result, { depth: 3 })}\n\`\`\``);
  } catch (error) {
    await message.reply(`**Error:**\n\`\`\`js\n${error.message}\n\`\`\``);
  }
});

// Function to evaluate code in a sandboxed environment
async function evalCode(code) {
  return new Promise((resolve, reject) => {
    try {
      const result = (async () => {
        const sandboxedCode = `(async () => { ${code} })()`;
        return await evalInSandbox(sandboxedCode);
      })();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Function to safely evaluate code in a sandbox
function evalInSandbox(code) {
  return new Promise((resolve, reject) => {
    try {
      const result = Function('"use strict"; return (' + code + ')')();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}