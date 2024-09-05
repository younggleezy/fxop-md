const { exec } = require('child_process');

function PM2KILL() {
  exec('pm2 stop all', (err, stdout, stderr) => {
    if (err || stderr) return console.error(`Error: ${err?.message || stderr}`);
  });
}

PM2KILL();