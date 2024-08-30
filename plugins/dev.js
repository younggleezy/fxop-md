const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { Module} = require('../lib/');
const bot = require('../lib');

const variableStore = new Map();
const commandHistory = [];

class CommandHandler {
  constructor() {
    this.customCommands = new Map();
  }

  async handleCommand(message, match, client) {
    if (!message.text.startsWith('$') && !message.text.startsWith('>')) return;

    let evalText = message.text.slice(1).trim();
    if (evalText.startsWith('$')) {
      evalText = evalText.slice(1).trim();
    }

    commandHistory.push(evalText);

    const commandParts = evalText.split(' ');
    const commandName = commandParts[0];

    try {
      let result;
      switch (commandName) {
        case 'shell':
          result = await this.handleShellCommand(commandParts.slice(1).join(' '));
          break;
        case 'listVars':
          result = await this.listVariables();
          break;
        case 'delVar':
          result = await this.deleteVariable(commandParts[1]);
          break;
        case 'cmd':
          result = await this.defineCustomCommand(commandParts.slice(1).join(' '));
          break;
        case 'store':
          result = await this.storeVariable(evalText.slice(6));
          break;
        case 'readFile':
          result = await this.readFile(commandParts[1]);
          break;
        case 'writeFile':
          result = await this.writeFile(commandParts[1], commandParts.slice(2).join(' '));
          break;
        case 'http':
          result = await this.makeHttpRequest(commandParts.slice(1));
          break;
        default:
          if (this.customCommands.has(commandName)) {
            result = await this.executeCustomCommand(commandName, message, match, client);
          } else {
            result = await this.evaluateCode(evalText, message, match, client);
          }
      }

      // Send the result back to the user
      await this.sendResult(result, message, client);
    } catch (error) {
      await this.sendResult(`Error: ${error.message}`, message, client);
    }
  }

  async sendResult(result, message, client) {
    const output = typeof result === 'object' ? util.inspect(result, { depth: null }) : String(result);
    await message.reply(output);
    // Fallback method if message.reply doesn't work
    if (client && client.sendMessage) {
      await client.sendMessage(message.chat, { text: output });
    }
  }

  async handleShellCommand(command) {
    try {
      const { stdout, stderr } = await execAsync(command);
      return stderr ? `Stderr: ${stderr}` : `Stdout: ${stdout}`;
    } catch (error) {
      throw new Error(`Shell command error: ${error.message}`);
    }
  }

  async listVariables() {
    const vars = Array.from(variableStore.entries())
      .map(([key, { value }]) => `${key}: ${util.inspect(value, { depth: null })}`)
      .join('
');
    return vars || 'No variables stored.';
  }

  async deleteVariable(key) {
    if (variableStore.has(key)) {
      clearTimeout(variableStore.get(key).timeout);
      variableStore.delete(key);
      return `Variable '${key}' deleted.`;
    } else {
      return `Variable '${key}' not found.`;
    }
  }

  async defineCustomCommand(commandDefinition) {
    const [cmdName, ...cmdBody] = commandDefinition.split(' ');
    const cmdFunction = new Function(
      'axios',
      'exec',
      'util',
      'message',
      'match',
      'client',
      'variableStore',
      'require',
      'fs',
      'path',
      cmdBody.join(' ')
    );
    this.customCommands.set(cmdName, cmdFunction);
    return `Custom command '${cmdName}' stored.`;
  }

  async storeVariable(assignment) {
    const [key, ...valueParts] = assignment.split('=');
    const trimmedKey = key.trim();
    const value = eval(valueParts.join('=').trim());
    
    if (variableStore.has(trimmedKey)) {
      clearTimeout(variableStore.get(trimmedKey).timeout);
    }

    variableStore.set(trimmedKey, {
      value: value,
      timeout: setTimeout(() => {
        variableStore.delete(trimmedKey);
      }, 10 * 60 * 1000), // 10 minutes
    });

    return `Stored variable '${trimmedKey}' with value: ${util.inspect(value, { depth: null })}`;
  }

  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return `File content:
${content}`;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content);
      return `File written successfully: ${filePath}`;
    } catch (error) {
      throw new Error(`Error writing file: ${error.message}`);
    }
  }

  async makeHttpRequest(args) {
    const [method, url, ...dataArgs] = args;
    const data = dataArgs.length ? JSON.parse(dataArgs.join(' ')) : undefined;
    
    try {
      const response = await axios({ method, url, data });
      return `Response: ${JSON.stringify(response.data, null, 2)}`;
    } catch (error) {
      throw new Error(`HTTP request error: ${error.message}`);
    }
  }

  async executeCustomCommand(commandName, message, match, client) {
    const customCommand = this.customCommands.get(commandName);
    try {
      return await customCommand(
        axios,
        exec,
        util,
        message,
        match,
        client,
        variableStore,
        require,
        fs,
        path
      );
    } catch (error) {
      throw new Error(`Error executing custom command: ${error.message}`);
    }
  }

  async evaluateCode(code, message, match, client) {
    const asyncEval = new Function(
      'axios',
      'exec',
      'util',
      'message',
      'match',
      'client',
      'variableStore',
      'require',
      'fs',
      'path',
      `
      return (async () => {
        const _sendMessage = async (content) => {
          await message.reply(content);
          if (client && client.sendMessage) {
            await client.sendMessage(message.chat, { text: content });
          }
        };
        const result = ${code};
        if (result instanceof Promise) {
          return await result;
        }
        return result;
      })();
      `
    );

    return await asyncEval(
      axios,
      exec,
      util,
      message,
      match,
      client,
      variableStore,
      require,
      fs,
      path
    );
  }
}

const commandHandler = new CommandHandler();

Module(
  {
    on: 'text',
    fromMe: true,
    dontAddCommandList: true,
  },
  async (message, match, client) => {
    await commandHandler.handleCommand(message, match, client);
  }
);