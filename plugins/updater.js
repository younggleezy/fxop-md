const { Module, mode } = require("../lib");
const { exec } = require("child_process");
const simpleGit = require("simple-git");
const git = simpleGit();

async function getUpdate() {
 try {
  await git.fetch();
  const branchSummary = await git.branch();
  const currentBranch = branchSummary.current;
  const status = await git.status();
  if (status.ahead > 0 || status.behind > 0) {
   return "already up to date";
  }

  const log = await git.log(["-1"]);
  const latestCommit = log.latest;

  return {
   commitHash: latestCommit.hash,
   author: latestCommit.author_name,
   date: latestCommit.date,
   message: latestCommit.message,
  };
 } catch (error) {
  console.error("Error fetching the latest commit:", error);
  return null;
 }
}

async function updateNow() {
 try {
  console.log("Stashing local changes...");
  await git.stash();
  console.log("Pulling latest changes...");
  const result = await git.pull();

  console.log("Pull result:", result);
 } catch (error) {
  console.error("Error during stash and pull:", error);
 }
}
const restartCommand = "pm2 restart fxop";

const restart = () => {
 exec(restartCommand, (error, stdout, stderr) => {
  if (error) {
   console.error(`Error restarting process: ${error.message}`);
   return;
  }
  if (stderr) {
   console.error(`stderr: ${stderr}`);
   return;
  }
  console.log(`stdout: ${stdout}`);
 });
};

Module(
 {
  pattern: "update",
  fromMe: mode,
  info: "Check for updates",
  type: "updater",
 },
 async (message, match) => {
  const isUpdate = await getUpdate();
  let updateMessage;

  if (typeof isUpdate === "string") {
   updateMessage = isUpdate;
  } else if (isUpdate && typeof isUpdate === "object") {
   updateMessage = `New update available:
 Commit: ${isUpdate.commitHash}
 Author: ${isUpdate.author}
 Date: ${isUpdate.date}
 Message: ${isUpdate.message}`;
  } else {
   updateMessage = "Unable to check for updates.";
  }

  await message.sendMessage(updateMessage);

  if (match == "now") {
   await updateNow();
   const updatedMessage = "```Bot Has Been Updated```";
   await message.sendMessage(updatedMessage);
   restart();
  } else if (match && match !== "now") {
   await message.sendMessage("Invalid update option. Use 'update now' to update the bot.");
  }
 }
);
