const { Module, mode } = require("../lib/");
const { exec } = require("child_process");
const os = require("os");
const si = require("systeminformation");

Module(
 {
  pattern: "ping",
  fromMe: mode,
  desc: "To check ping",
  type: "system",
 },
 async (message, match) => {
  const start = new Date().getTime();
  const sentMessage = await message.sendMessage("```Ping!```");
  const end = new Date().getTime();
  const pingTime = end - start;
  await new Promise((resolve) => setTimeout(resolve, 100));
  await message.edit(`*Pong!*\n ${pingTime} *ms*`, sentMessage.key);
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
