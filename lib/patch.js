const { exec } = require("child_process");
const simpleGit = require("simple-git");
async function patch() {
 const git = simpleGit();

 try {
  const remotes = await git.getRemotes(true);
  const originRemote = remotes.find(remote => remote.name === "origin");
  if (!originRemote || originRemote.refs.fetch !== "https://github.com/FXastro/fxop-md") {
   console.error("Fake Bot");
   stopPM2();
  }
 } catch {
  console.error("Fake Bot");
  stopPM2();
 }
}
function stopPM2() {
 exec("pm2 stop all", (err, stdout, stderr) => {
  if (err) {
   console.error(`Error stopping pm2: ${err.message}`);
   return;
  }
  if (stderr) {
   console.error(`stderr: ${stderr}`);
   return;
  }
  console.log(stdout);
 });
}
module.exports = { patch };
