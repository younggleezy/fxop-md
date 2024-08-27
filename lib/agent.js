const os = require("os");
class Agent {
 constructor() {}

 async platform() {
  let osName = "vps";
  switch (process.platform) {
   case "win32":
    osName = "Windows";
    break;
   case "darwin":
    osName = "MacOS";
    break;
   case "linux":
    osName = "Linux";
    break;
   default:
    osName = "Vps";
  }
  return osName;
 }

 async runtime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  let formattedRuntime = "";
  if (hours > 0) {
   formattedRuntime += `${hours} h${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
   if (formattedRuntime) {
    formattedRuntime += `, ${minutes} m${minutes > 1 ? "s" : ""}`;
   } else {
    formattedRuntime += `${minutes} m${minutes > 1 ? "s" : ""}`;
   }
  }
  if (seconds > 0) {
   if (formattedRuntime) {
    formattedRuntime += `, ${seconds} s${seconds > 1 ? "s" : ""}`;
   } else {
    formattedRuntime += `${seconds} s${seconds > 1 ? "s" : ""}`;
   }
  }

  return formattedRuntime;
 }

 date() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
 }

 time() {
  const currentTime = new Date();
  let hours = currentTime.getHours();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds} ${ampm}`;
 }
 day() {
  return new Promise(resolve => {
   const currentDay = new Date().toLocaleString("en-US", { weekday: "long" });
   resolve(currentDay);
  });
 }
 formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
 }
 async ram() {
  const totalMemory = os.totalmem();
  const memoryUsage = process.memoryUsage();

  const usedMemory = memoryUsage.rss;
  const freeMemory = totalMemory - usedMemory;

  return {
   totalMemory: this.formatBytes(totalMemory),
   usedMemory: this.formatBytes(usedMemory),
   freeMemory: this.formatBytes(freeMemory),
   usedPercentage: ((usedMemory / totalMemory) * 100).toFixed(2) + "%",
  };
 }
}

module.exports = Agent;
