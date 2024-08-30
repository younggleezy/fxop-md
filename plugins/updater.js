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
  await message.sendMessage(message.jid, isUpdate);
  if (match == "now") {
   await updateNow();
   const updatedMessage = `\`\`\`Bot Has Been Updated\`\`\``;
   await message.sendMessage(message.jid, updatedMessage);
   await restart();
  } else {
   await message.sendMessage(message.jid, `Something isn't right`);
  }
 }
);
