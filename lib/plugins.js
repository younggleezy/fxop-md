const config = require("../config");
const commands = [];

/**
 * Registers a command by defining its properties and storing it in the commands array.
 * This function allows you to associate a specific function with a command pattern.
 *
 * @param {Object} commandInfo - The metadata and options for the command.
 * @param {string} commandInfo.pattern - The regex pattern to match the command. The pattern is combined with the configured handler prefix.
 * @param {boolean} [commandInfo.dontAddCommandList=false] - Whether the command should be excluded from the list of available commands.
 * @param {boolean} [commandInfo.fromMe=false] - If true, the command will only trigger for messages sent by the bot itself.
 * @param {string} [commandInfo.type='misc'] - The category type of the command, used for organizational purposes.
 * @param {Function} func - The function to execute when the command is triggered. The function receives the message object and other context as arguments.
 * @returns {Object} - Returns the command information object after updating it and adding the function.
 */
function command(commandInfo, func) {
 commandInfo.function = func;
 if (commandInfo.pattern) {
  commandInfo.pattern = new RegExp(`(${config.HANDLERS})( ?${commandInfo.pattern}(?=\\b|$))(.*)`, "is") || false;
 }
 commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
 commandInfo.fromMe = commandInfo.fromMe || false;
 commandInfo.type = commandInfo.type || "misc";

 commands.push(commandInfo);
 return commandInfo;
}

module.exports = {
 command,
 commands,
};
