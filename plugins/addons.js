const { command, isPrivate } = require("../lib/");
const config = require("../config");

// Command to manage automatic status updates
command(
  {
    pattern: "autostatus",
    fromMe: isPrivate,
    desc: "Manage automatic status updates",
    type: "admin",
  },
  async (message, match) => {
    const [action, ...statusWords] = match.split(" ");

    switch (action) {
      case "on":
        config.AUTO_STATUS = true;
        await message.reply("Automatic status updates have been enabled.");
        break;
      case "off":
        config.AUTO_STATUS = false;
        await message.reply("Automatic status updates have been disabled.");
        break;
      case "add":
        if (statusWords.length === 0) {
          await message.reply("Please provide a status to add.");
          return;
        }
        const newStatus = statusWords.join(" ");
        config.STATUS_MESSAGES.push(newStatus);
        await message.reply(`Added new status: ${newStatus}`);
        break;
      case "list":
        const statusList = config.STATUS_MESSAGES.map(
          (status, index) => `${index + 1}. ${status}`,
        ).join("\n");
        await message.reply(`Current status messages:\n${statusList}`);
        break;
      default:
        await message.reply(
          "Usage: .autostatus [on|off|add|list] [new status message]",
        );
    }
  },
);

command(
  {
    pattern: "cooldown",
    fromMe: isPrivate,
    desc: "Manage command cooldowns",
    type: "admin",
  },
  async (message, match) => {
    const [action, commandName, cooldownTime] = match.split(" ");

    switch (action) {
      case "set":
        if (!commandName || !cooldownTime) {
          await message.reply(
            "Please provide both command name and cooldown time in seconds.",
          );
          return;
        }
        config.COOLDOWNS[commandName] = parseInt(cooldownTime) * 1000; // Convert to milliseconds
        await message.reply(
          `Cooldown for ${commandName} set to ${cooldownTime} seconds.`,
        );
        break;
      case "remove":
        if (!commandName) {
          await message.reply(
            "Please provide the command name to remove cooldown.",
          );
          return;
        }
        delete config.COOLDOWNS[commandName];
        await message.reply(`Cooldown for ${commandName} has been removed.`);
        break;
      case "list":
        const cooldownList = Object.entries(config.COOLDOWNS)
          .map(([cmd, time]) => `${cmd}: ${time / 1000} seconds`)
          .join("\n");
        await message.reply(`Current cooldowns:\n${cooldownList}`);
        break;
      default:
        await message.reply(
          "Usage: .cooldown [set|remove|list] [command name] [cooldown time in seconds]",
        );
    }
  },
);

// Example of how to use the cooldown system in an existing command
command(
  {
    pattern: "pings",
    fromMe: isPrivate,
    desc: "To check ping",
    type: "user",
  },
  async (message, match) => {
    // Check if the command is on cooldown
    if (
      !applyCooldown(message.sender, "ping", config.COOLDOWNS["ping"] || 5000)
    ) {
      await message.reply(
        "This command is on cooldown. Please wait before using it again.",
      );
      return;
    }

    // Original ping command logic
    const start = new Date().getTime();
    await message.reply("Ping!");
    const end = new Date().getTime();
    await message.reply(`Pong! ${end - start}ms`);
  },
);

// Helper function to apply cooldown
function applyCooldown(userId, commandName, cooldownTime) {
  const key = `${userId}-${commandName}`;
  const now = Date.now();
  if (global.cooldowns.has(key)) {
    const expirationTime = global.cooldowns.get(key);
    if (now < expirationTime) {
      return false;
    }
  }
  global.cooldowns.set(key, now + cooldownTime);
  return true;
}
