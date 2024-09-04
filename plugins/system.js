const { command, mode } = require("../lib");
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

const restart = () => {
 exec("npm restart", (error, stdout, stderr) => {
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

command(
 {
  pattern: "update",
  fromMe: mode,
  info: "Check for updates",
  type: "system",
 },
 async message => {
  const hasUpdates = await checkForUpdates();

  if (!hasUpdates) {
   await message.send("You are on the latest version.");
   return;
  }

  await message.send("Updating...");
  const updateSuccess = await updateNow();

  if (updateSuccess) {
   await message.send("```Updated, Restarting```");
   setTimeout(() => {
    restart();
   }, 3000);
  } else {
   await message.send("Update failed. Please try again later.");
  }
 }
);

command(
 {
  pattern: "upgrade",
  fromMe: mode,
  desc: "Upgrade project dependencies",
  type: "system",
 },
 async (message, match) => {
  await message.reply("Upgrading dependencies... Please wait.");

  exec("npm install && npm upgrade", (error, stdout, stderr) => {
   if (error) {
    message.reply(`Upgrade failed: ${error.message}`);
    return;
   }
   if (stderr) {
    message.reply(`Upgrade process encountered some issues: ${stderr}`);
    return;
   }
   message.reply(`Successfully upgraded dependencies:\n\n${stdout}`);
  });
 }
);
