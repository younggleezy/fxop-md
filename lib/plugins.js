const config = require("../config");
const commands = [];

/**
 * Defines a command and stores it in the commands array.
 *
 * @param {Object} commandInfo - Information about the command.
 * @param {Function} func - The function to execute when the command is triggered.
 * @returns {Object} - The command information.
 */
function Module(commandInfo, func) {
 commandInfo.pattern = commandInfo.pattern || new RegExp(`(${config.HANDLERS})( ?${commandInfo.command}(?=\\b|$))(.*)`, "is");
 commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
 commandInfo.fromMe = commandInfo.fromMe || false;
 commandInfo.type = commandInfo.type || "misc";

 commandInfo.function = func;
 commands.push(commandInfo);

 return commandInfo;
}

const Function = Module;

module.exports = {
 Module,
 Function,
 commands,
};
