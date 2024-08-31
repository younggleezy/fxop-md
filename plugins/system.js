const { Module, mode } = require("../lib/");
const { exec } = require("child_process");
const os = require("os");
const si = require("systeminformation");

Module(
  {
   pattern: "ping",
   fromMe: mode,
   desc: "Bot response in milliseconds.",
   type: "system",
  },
  async (message) => {
   const start = new Date().getTime();
   const msg = await message.reply("*ᴩɪɴɢ...*");
   const end = new Date().getTime();
   const responseTime = ((end - start) / 1000).toFixed(3); // Round to 3 decimal places
   try {
     await msg.edit(`*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ: ${responseTime} secs*`);
   } catch (error) {
     console.error("Error editing ping message:", error);
     await message.reply(`*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ: ${responseTime} secs* (Edit failed)`);
   }
  }
 );

Module(
 {
  pattern: "restart",
  fromMe: mode,
  desc: "Restart the bot/application",
  type: "system",
 },
 async (message, match) => {
  await message.reply("Restarting the application...");

  exec("pm2 restart all", (error, stdout, stderr) => {
   if (error) {
    message.reply(`Failed to restart: ${error.message}`);
    return;
   }
   if (stderr) {
    message.reply(`Restart encountered issues: ${stderr}`);
    return;
   }
   message.reply("Successfully restarted the application.");
  });
 }
);

Module(
 {
  pattern: "shutdown",
  fromMe: mode,
  desc: "Shutdown the bot/application",
  type: "system",
 },
 async (message, match) => {
  await message.reply("Shutting down the application...");
  process.exit(0); // Gracefully shut down the process
 }
);

Module(
 {
  pattern: "cpu",
  fromMe: mode,
  desc: "Show CPU information",
  type: "system",
 },
 async (message, match) => {
  const cpus = os.cpus();
  const cpuInfo = cpus[0]; // Get information for the first CPU core

  await message.reply(`CPU Information:\nModel: ${cpuInfo.model}\nSpeed: ${cpuInfo.speed} MHz\nCores: ${cpus.length}`);
 }
);

// Server Command
Module(
 {
  pattern: "server",
  fromMe: mode,
  desc: "Show server information (CPU, RAM, GPU, OS)",
  type: "system",
 },
 async (message, match) => {
  try {
   const cpuData = await si.cpu();
   const memData = await si.mem();
   const gpuData = await si.graphics();
   const osData = await si.osInfo();

   const cpuName = cpuData.manufacturer + " " + cpuData.brand;
   const ramSize = (memData.total / 1024 ** 3).toFixed(2) + " GB"; // Convert bytes to GB
   const gpuName = gpuData.controllers.length > 0 ? gpuData.controllers[0].model : "Not Available";
   const operatingSystem = osData.distro ? osData.distro : "VPS Container";

   await message.reply(`Server Information:\nCPU: ${cpuName}\nRAM: ${ramSize}\nGPU: ${gpuName}\nOS: ${operatingSystem}`);
  } catch (error) {
   await message.reply(`Error fetching server information: ${error.message}`);
  }
 }
);
