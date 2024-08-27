const axios = require("axios");
const { exec } = require("child_process");
const util = require("util");
const { command } = require("../lib/");

const variableStore = new Map();
const commandHistory = [];

// Command handler
command(
  {
    on: "text",
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message) => {
    if (!message.text.startsWith("$") && !message.text.startsWith(">")) return;

    let evalText = message.text.slice(1).trim();
    if (evalText.startsWith("$")) {
      evalText = evalText.slice(1).trim();
    }

    // Log the command
    commandHistory.push(evalText);

    try {
      // Handle shell commands
      if (evalText.startsWith("shell:")) {
        const shellCommand = evalText.slice(6).trim();
        exec(shellCommand, (error, stdout, stderr) => {
          if (error) {
            message.reply(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            message.reply(`Stderr: ${stderr}`);
            return;
          }
          message.reply(`Stdout: ${stdout}`);
        });
        return;
      }

      // Handle variable listing
      if (evalText === "listVars") {
        const vars = Array.from(variableStore.entries())
          .map(([key, { value }]) => `${key}: ${util.inspect(value)}`)
          .join("\n");
        await message.reply(vars || "No variables stored.");
        return;
      }

      // Handle variable deletion
      if (evalText.startsWith("delVar ")) {
        const key = evalText.slice(7).trim();
        if (variableStore.has(key)) {
          clearTimeout(variableStore.get(key).timeout);
          variableStore.delete(key);
          await message.reply(`Variable '${key}' deleted.`);
        } else {
          await message.reply(`Variable '${key}' not found.`);
        }
        return;
      }

      // Handle custom commands
      if (evalText.startsWith("cmd:")) {
        const [cmdName, ...cmdBody] = evalText.slice(4).split(" ", 2);
        const cmdFunction = new Function(
          "axios",
          "exec",
          "util",
          "message",
          "variableStore",
          cmdBody.join(" ")
        );
        // Store custom commands
        variableStore.set(cmdName, {
          value: cmdFunction,
          timeout: setTimeout(() => {
            variableStore.delete(cmdName);
          }, 10 * 60 * 1000), // 10 minutes
        });
        await message.reply(`Custom command '${cmdName}' stored.`);
        return;
      }

      if (variableStore.has(evalText)) {
        const customCommand = variableStore.get(evalText).value;
        try {
          let result = await customCommand(axios, exec, util, message, variableStore);
          result = typeof result === "object" ? util.inspect(result) : String(result);
          await message.reply(result);
        } catch (error) {
          await message.reply(`Error executing custom command: ${error.message}`);
        }
        return;
      }

      const asyncEval = new Function(
        "axios",
        "exec",
        "util",
        "message",
        "variableStore",
        `return (async () => { ${evalText} })();`
      );

      let result = await asyncEval(axios, exec, util, message, variableStore);
      if (result !== undefined) {
        result = typeof result === "object" ? util.inspect(result) : String(result);
        await message.reply(result);
      }
    } catch (error) {
      await message.reply(`Error: ${error.message}`);
    }
  }
);

function storeVariable(key, value) {
  if (variableStore.has(key)) {
    clearTimeout(variableStore.get(key).timeout);
  }

  // Store the variable
  variableStore.set(key, {
    value: value,
    timeout: setTimeout(() => {
      variableStore.delete(key);
    }, 10 * 60 * 1000), // 10 minutes
  });
}

command(
  {
    on: "text",
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message) => {
    if (!message.text.startsWith("$store ")) return;

    let [key, value] = message.text.slice(7).split("=", 2);
    key = key.trim();
    value = value ? eval(value.trim()) : undefined;

    if (key) {
      storeVariable(key, value);
      await message.reply(`Stored variable '${key}' with value: ${util.inspect(value)}`);
    }
  }
);
