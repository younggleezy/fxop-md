const { Module, mode } = require("../lib");
const simpleGit = require("simple-git");
const { exec } = require("child_process");
const { promisify } = require("util");

const git = simpleGit();
const execPromise = promisify(exec);

Module(
 {
  pattern: "update",
  fromMe: mode,
  info: "Check for updates",
  type: "updater",
 },
 async (message, match) => {
  if (match === "now") {
   try {
    // Stash any local changes and pull the latest changes
    await execPromise("git stash && git pull");
    await message.sendMessage(message.jid, "> Successfully Updated Bot\n\nRestarting Now...");
    await exec('pm2 restart')

    // Get the current branch name
    const status = await git.status();
    const currentBranch = status.current;

    // Fetch from the remote repository
    await git.fetch();

    // Compare the local branch with the remote branch
    const remoteBranch = `origin/${currentBranch}`;
    const diffSummary = await git.diffSummary([currentBranch, remoteBranch]);

    if (diffSummary.files.length === 0) {
     await message.sendMessage(message.jid, "Already up to date.");
     return;
    }

    // Get the latest commit from the remote branch
    const log = await git.log([remoteBranch]);
    const latestCommit = log.latest;

    // Send the contributor's name
    await message.sendMessage(message.jid, `Committer: ${latestCommit.author_name}`);

    // Send changes in the specified format
    const changeMessages = diffSummary.files
     .map((file) => {
      const status = file.changes > 0 ? "updated" : "deleted";
      const sign = file.changes > 0 ? "+" : "-";
      return `Astro: ${status} ${file.file} ${sign}${Math.abs(file.changes)}`;
     })
     .join("\n");

    await message.sendMessage(message.jid, changeMessages);
   } catch (error) {
    await message.sendMessage(message.jid, `Error executing git commands or fetching changes: ${error.message}`);
   }
  }
 }
);
