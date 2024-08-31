const config = require("../config");
const commands = [];
const PREFIX = HANDLERS && !HANDLERS.startsWith("^") ? HANDLERS.replace(/[[\].]/g, "\\$&") : /\p{Emoji_Presentation}/gu.test(HANDLERS) ? "^[.]" : HANDLERS;
config.HANDLERS = PREFIX;
/**
 * Define a command and store it in the commands array.
 * @param {Object} commandInfo - Information about the command.
 * @param {Function} func - The function to execute when the command is triggered.
 * @returns {Object} - The command information.
 */
function Module(commandInfo, func) {
 commandInfo.function = func;
 if (commandInfo.pattern) {
  commandInfo.pattern = new RegExp(((commandInfo.handler ?? true) ? PREFIX : "") + commandInfo.pattern, commandInfo.flags ?? "");
 } else {
  commandInfo.pattern = new RegExp((PREFIX.startsWith("^") ? PREFIX : "^.+" + PREFIX) + "(" + commandInfo.pattern + "| " + commandInfo.pattern + ")", "is");
 }
 commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
 commandInfo.fromMe = commandInfo.fromMe || false;
 commandInfo.type = commandInfo.type || "misc";

 commands.push(commandInfo);
 return commandInfo;
}

const Function = Module;

module.exports = {
 Module,
 Function,
 commands,
};
