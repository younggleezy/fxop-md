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
let x_astrial = true;
command(
  {
    pattern: "protect",
    fromMe: mode,
    dontAddCommandList: true,
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const isAdmin = await isBotAdmin(message);
    if (!isAdmin) {
      await message.reply("Youre not an admin");
      return;
    } const action = match.trim().toLowerCase();
    if (action === 'on') {
      x_astrial = true;
      await message.reply("Admin protection enabled");
    } else if (action === 'off') {
      x_astrial = false;
      await message.reply("Admin protection disabled");
    } else {
      await message.reply("e.g protect on/off");
    }
  }
);

command(
  {
    on: 'gcupdate',
    fromMe: mode,
    dontAddCommandList: true,
  },
  async (message) => {
    const { action, participants } = message;
    if (!x_astrial) return;
    if (action === 'promote' || action === 'demote') {
      const isAdmin = await isBotAdmin(message);
      if (!isAdmin) return;
      const groupMetadata = await message.client.groupMetadata(message.jid);
      const PAST_TEST = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
      for (const participant of participants) {
        if (action === 'promote' && !PAST_TEST.includes(participant)) {
          await message.client.groupParticipantsUpdate(message.jid, [participant], 'promote');
        } if (action === 'demote' && PAST_TEST.includes(participant)) {
          await message.client.groupParticipantsUpdate(message.jid, [participant], 'demote');
        }
      }
    }
  }
);
