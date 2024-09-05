const { exec } = require("child_process");

async function PM2KILL() {
 exec("pm2 stop all", (err, stdout, stderr) => {
  if (err || stderr) return;
 });
}

PM2KILL();
