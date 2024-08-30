const { Module, mode } = require("../lib");
const { exec } = require("child_process");
const simpleGit = require("simple-git");
const git = simpleGit();

async function checkForUpdates() {
 try {
  await git.fetch();
  const status = await git.status();
  return status.behind > 0;
 } catch (error) {
  console.error("Error checking for updates:", error);
  return false;
 }
}

async function updateNow() {
 try {
  console.log("Stashing local changes...");
  await git.stash();

  console.log("Pulling latest changes...");
  await git.pull();

  return true;
 } catch (error) {
  console.error("Error during update:", error);
  return false;
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
 async (message) => {
  const hasUpdates = await checkForUpdates();

  if (!hasUpdates) {
   await message.sendMessage("You are on the latest version.");
   return;
  }

  await message.sendMessage("Updating...");
  const updateSuccess = await updateNow();

  if (updateSuccess) {
   await message.sendMessage("Bot updated. Now restarting in 3 seconds...");
   setTimeout(() => {
    restart();
   }, 3000);
  } else {
   await message.sendMessage("Update failed. Please try again later.");
  }
 }
);
