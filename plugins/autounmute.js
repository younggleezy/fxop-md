const { command, mode } = require('../lib/');
const moment = require('moment');

command(
  {
    pattern: "autounmute",
    fromMe: mode,
    dontAddCommandList: true,
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const isAdmin = await isBotAdmin(message);
    if (!isAdmin) {
      await message.reply("_Youre not an admin_");
      return;
      const meow = /autounmute\s*(on|off)?\s*([0-9]{2}:[0-9]{2})?/i;
    } const [_, toggle, time] = match.match(meow) || [];
    if (toggle === 'on') {
      await message.reply("Auto-unmute_enabled");
      return;
    }   if (toggle === 'off') {
      await message.reply("Auto-unmute_disabled");
      return;
    }
    if (time) {
      const [hour, minute] = time.split(':');
      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        await message.reply("*use*: HH:MM.");
        return;
      } const now = moment();
      const naxor_ser = moment().hours(hour).minutes(minute).seconds(0);
      if (naxor_ser.isBefore(now)) {
        await message.reply("Please use_future *time*");
        return;
      }
      const delay = naxor_ser.diff(now);
      setTimeout(async () => {
        await message.client.groupSettingUpdate(message.jid, 'not_announcement');
        await message.reply('*utomatically unmuted*');
      }, delay);
      await message.reply(`Gc will be unmuted at ${time}`);
    } else {
      await message.reply("'autounmute HH:MM' to set the time, or 'autounmute on' / 'autounmute off' to toggle");
    }
  }
);
const isBotAdmin = async (message) => {
  const groupMetadata = await message.client.groupMetadata(message.jid);
  const participants = groupMetadata.participants;
  const groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
  return groupAdmins.includes(message.pushName);
};
      
