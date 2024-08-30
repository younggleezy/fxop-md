const { Module, mode } = require("../lib");
const { exec } = require("child_process");
const simpleGit = require("simple-git");
const git = simpleGit();

async function getUpdate() {
 try {
  await git.fetch();
  const status = await git.status();

  if (status.behind === 0) {
   return "You are already on the latest version.";
  }

  const diff = await git.diffSummary(["HEAD..@{u}"]);
  const log = await git.log(["HEAD..@{u}"]);
  const latestCommit = log.latest;

  return {
   commitHash: latestCommit.hash,
   author: latestCommit.author_name,
   date: latestCommit.date,
   message: latestCommit.message,
   changedFiles: diff.files.length,
   insertions: diff.insertions,
   deletions: diff.deletions,
  };
 } catch (error) {
  console.error("Error checking for updates:", error);
  return null;
 }
}

async function updateNow() {
 try {
  const status = await git.status();

  if (status.behind === 0) {
   return "Already updated to the latest version.";
  }

  console.log("Stashing local changes...");
  await git.stash();

  console.log("Pulling latest changes...");
  const pullResult = await git.pull();

  console.log("Pull result:", pullResult);
  return "Update successful. Restarting...";
 } catch (error) {
  console.error("Error during update:", error);
  return "Error occurred during update.";
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
  let updateMessage; // Declare the variable here

  const updateInfo = await getUpdate();

  if (typeof updateInfo === "string") {
   // No updates available
   updateMessage = "You are on the latest version.";
  } else if (updateInfo && typeof updateInfo === "object") {
   // Update is available
   updateMessage = `> *NEW UPDATE*\n\`\`\`${updateInfo.author}\`\`\`\n\n\`\`\`Details: ${updateInfo.message}\`\`\``;

   await message.sendMessage(updateMessage);

   if (match === "now") {
    await updateNow();
    const updatedMessage = "```Bot Has Been Updated```";
    await message.sendMessage(updatedMessage);
    restart();
    return; // Exit after restart
   } else if (match && match !== "now") {
    await message.sendMessage("Invalid update option. Use 'update now' to update the bot.");
   }
  } else {
   updateMessage = "Unable to check for updates.";
  }

  await message.sendMessage(updateMessage);
 }
);
