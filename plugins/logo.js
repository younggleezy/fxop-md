const { command, Ephoto360API } = require("../lib");
command(
 {
  pattern: "ep1",
  fromMe: true,
  desc: "Logo Maker",
  type: "eps",
 },
 async (m, match) => {
  if (!match) return await m.sendReply("_Give Me Text_");
  await m.sendReply("_Creating Design_")
  const logo = new Ephoto360API()
  const img = await logo.glossysilver(match)
  return m.send(img, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363327841612745@newsletter", newsletterName: "ɢʟᴏssʏ sɪʟᴠᴇʀ" } } })
 }
);
