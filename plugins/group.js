const { command, mode, parsedJid, isAdmin } = require("../lib/");
const { setMessage, getMessage, delMessage, getStatus, toggleStatus } = require("../lib/database").Greetings;
const { banUser, unbanUser, isBanned } = require("../lib/database/ban");
const { setAntiPromote, getAntiPromote, setAntiDemote, getAntiDemote } = require("../lib/database/groupSettings.js");
const { getAntiWords, addStrike, resetStrikes, getStrikes } = require("../lib/database/antiword");
command(
   {
      pattern: "add",
      fromMe: mode,
      desc: "add a person to group",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");

      match = match || message.reply_message.jid;
      if (!match) return await message.reply("_Mention user to add");

      const isadmin = await isAdmin(message.jid, message.user, message.client);

      if (!isadmin) return await message.reply("_I'm not admin_");
      const jid = parsedJid(match);

      await message.client.groupParticipantsUpdate(message.jid, jid, "add");

      return await message.reply(`_@${jid[0].split("@")[0]} added_`, {
         mentions: [jid],
      });
   }
);

command(
   {
      pattern: "kick",
      fromMe: mode,
      desc: "kicks a person from group",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");

      match = match || message.reply_message.jid;
      if (!match) return await message.reply("_Mention user to kick_");

      const isadmin = await isAdmin(message.jid, message.user, message.client);

      if (!isadmin) return await message.reply("_I'm not admin_");
      const jid = parsedJid(match);

      await message.client.groupParticipantsUpdate(message.jid, jid, "remove");

      return await message.reply(`_@${jid[0].split("@")[0]} kicked_`, {
         mentions: [jid],
      });
   }
);
command(
   {
      pattern: "promote",
      fromMe: mode,
      desc: "promote to admin",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");

      match = match || message.reply_message.jid;
      if (!match) return await message.reply("_Mention user to promote_");

      const isadmin = await isAdmin(message.jid, message.user, message.client);

      if (!isadmin) return await message.reply("_I'm not admin_");
      const jid = parsedJid(match);

      await message.client.groupParticipantsUpdate(message.jid, jid, "promote");

      return await message.reply(`_@${jid[0].split("@")[0]} promoted as admin_`, {
         mentions: [jid],
      });
   }
);
command(
   {
      pattern: "demote",
      fromMe: mode,
      desc: "demote from admin",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");

      match = match || message.reply_message.jid;
      if (!match) return await message.reply("_Mention user to demote_");

      const isadmin = await isAdmin(message.jid, message.user, message.client);

      if (!isadmin) return await message.reply("_I'm not admin_");
      const jid = parsedJid(match);

      await message.client.groupParticipantsUpdate(message.jid, jid, "demote");

      return await message.reply(`_@${jid[0].split("@")[0]} demoted from admin_`, {
         mentions: [jid],
      });
   }
);

command(
   {
      pattern: "mute",
      fromMe: mode,
      desc: "nute group",
      type: "group",
   },
   async (message, match, m, client) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      await message.reply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
   }
);

command(
   {
      pattern: "unmute",
      fromMe: mode,
      desc: "unmute group",
      type: "group",
   },
   async (message, match, m, client) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      await message.reply("_Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
   }
);

command(
   {
      pattern: "gjid",
      fromMe: mode,
      desc: "gets jid of all group members",
      type: "group",
   },
   async (message, match, m, client) => {
      if (!message.isGroup) return await message.reply("_This command is for groups_");
      let { participants } = await client.groupMetadata(message.jid);
      let participant = participants.map(u => u.id);
      let str = "╭──〔 *Group Jids* 〕\n";
      participant.forEach(result => {
         str += `├ *${result}*\n`;
      });
      str += `╰──────────────`;
      message.reply(str);
   }
);

command(
   {
      pattern: "tagall",
      fromMe: mode,
      desc: "mention all users in group",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return;
      const { participants } = await message.client.groupMetadata(message.jid);
      let teks = "";
      for (let mem of participants) {
         teks += ` @${mem.id.split("@")[0]}\n`;
      }
      message.sendMessage(message.jid, teks.trim(), {
         mentions: participants.map(a => a.id),
      });
   }
);

command(
   {
      pattern: "tag",
      fromMe: mode,
      desc: "mention all users in group",
      type: "group",
   },
   async (message, match) => {
      console.log("match");
      match = match || message.reply_message.text;
      if (!match) return message.reply("_Enter or reply to a text to tag_");
      if (!message.isGroup) return;
      const { participants } = await message.client.groupMetadata(message.jid);
      message.sendMessage(message.jid, match, {
         mentions: participants.map(a => a.id),
      });
   }
);

command(
   {
      pattern: "welcome",
      fromMe: mode,
      desc: "description",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return;
      let { prefix } = message;
      let status = await getStatus(message.jid, "welcome");
      let stat = status ? "on" : "off";

      if (!match) {
         let replyMsg = `Welcome manager\n\nGroup: ${(await message.client.groupMetadata(message.jid)).subject}\nStatus: ${stat}\n\nAvailable Actions:\n\n- ${prefix}welcome get: Get the welcome message\n- ${prefix}welcome on: Enable welcome message\n- ${prefix}welcome off: Disable welcome message\n- ${prefix}welcome delete: Delete the welcome message`;

         return await message.reply(replyMsg);
      }

      if (match === "get") {
         let msg = await getMessage(message.jid, "welcome");
         if (!msg) return await message.reply("_There is no welcome set_");
         return message.reply(msg.message);
      }

      if (match === "on") {
         let msg = await getMessage(message.jid, "welcome");
         if (!msg) return await message.reply("_There is no welcome message to enable_");
         if (status) return await message.reply("_Welcome already enabled_");
         await toggleStatus(message.jid);
         return await message.reply("_Welcome enabled_");
      }

      if (match === "off") {
         if (!status) return await message.reply("_Welcome already disabled_");
         await toggleStatus(message.jid, "welcome");
         return await message.reply("_Welcome disabled_");
      }

      if (match == "delete") {
         await delMessage(message.jid, "welcome");
         return await message.reply("_Welcome deleted successfully_");
      }
      await setMessage(message.jid, "welcome", match);
      return await message.reply("_Welcome set successfully_");
   }
);

command(
   {
      pattern: "goodbye",
      fromMe: mode,
      desc: "description",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return;
      let status = await getStatus(message.jid, "goodbye");
      let stat = status ? "on" : "off";
      let replyMsg = `Goodbye manager\n\nGroup: ${(await message.client.groupMetadata(message.jid)).subject}\nStatus: ${stat}\n\nAvailable Actions:\n\n- goodbye get: Get the goodbye message\n- goodbye on: Enable goodbye message\n- goodbye off: Disable goodbye message\n- goodbye delete: Delete the goodbye message`;

      if (!match) {
         return await message.reply(replyMsg);
      }

      if (match === "get") {
         let msg = await getMessage(message.jid, "goodbye");
         if (!msg) return await message.reply("_There is no goodbye set_");
         return message.reply(msg.message);
      }

      if (match === "on") {
         await toggleStatus(message.jid, "goodbye");
         return await message.reply("_Goodbye enabled_");
      }

      if (match === "off") {
         await toggleStatus(message.jid);
         return await message.reply("_Goodbye disabled_");
      }

      if (match === "delete") {
         await delMessage(message.jid, "goodbye");
         return await message.reply("_Goodbye deleted successfully_");
      }

      await setMessage(message.jid, "goodbye", match);
      return await message.reply("_Goodbye set successfully_");
   }
);

command(
   {
      on: "message",
      fromMe: mode,
      dontAddCommandList: true,
   },
   async (message, match) => {
      if (!message.isBaileys) return;
      const isban = await isBanned(message.jid);
      if (!isban) return;
      await message.reply("_Bot is banned in this chat_");
      const jid = parsedJid(message.participant);
      return await message.client.groupParticipantsUpdate(message.jid, jid, "remove");
   }
);

command(
   {
      pattern: "banbot",
      fromMe: mode,
      desc: "ban bot from a chat",
      type: "",
   },
   async (message, match) => {
      const chatid = message.jid;
      const isban = await isBanned(chatid);
      if (isban) {
         return await message.sendMessage(message.jid, "Bot is already banned");
      }
      await banUser(chatid);
      return await message.sendMessage(message.jid, "Bot banned");
   }
);

command(
   {
      pattern: "unbanbot",
      fromMe: mode,
      desc: "Unban bot from a chat",
      type: "user",
   },
   async (message, match) => {
      const chatid = message.jid;
      const isban = await isBanned(chatid);
      if (!isban) {
         return await message.sendMessage(message.jid, "Bot is not banned");
      }
      await unbanUser(chatid);
      return await message.sendMessage(message.jid, "Bot unbanned");
   }
);

command(
   {
      pattern: "ginfo",
      fromMe: mode,
      desc: "Get Group Data",
      type: "group",
   },
   async (message, match) => {
      match = match ? match : message.reply_text;
      if (!match) return await message.reply("_Group Link?_");
      let groupId = match[1].trim();
      const groupInfo = await message.client.groupGetInviteInfo(groupId);

      if (groupInfo) {
         const creationDate = new Date(groupInfo.creation * 1000);
         const createdAt = `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1).toString().padStart(2, "0")}-${creationDate.getDate().toString().padStart(2, "0")}`;

         let participants = groupInfo.size > 3 ? `${groupInfo.size} members` : `${groupInfo.size} members`;

         let message = `${groupInfo.subject}\n\n`;
         message += `  Creator: wa.me/${groupInfo.owner.split("@")[0]}\n`;
         message += `  Group ID: \`\`\`${groupInfo.id}\`\`\`\n`;
         message += `  *Muted:* ${groupInfo.announce ? "yes" : "no"}\n`;
         message += `  *Locked:* ${groupInfo.restrict ? "yes" : "no"}\n`;
         message += `  *Created at:* ${createdAt}\n`;
         message += `  *Participants:* ${participants}\n`;

         if (groupInfo.desc) {
            message += `  *Description:* ${groupInfo.desc}\n`;
         }

         return await send(message, message.trim(), {
            mentions: [groupInfo.owner],
         });
      } else {
         await message.send("_Group Not Found!_");
      }
   }
);

command(
   {
      pattern: "groupname",
      fromMe: mode,
      desc: "Change the group name",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      if (!match) return await message.reply("_Provide a new group name_");

      await message.client.groupUpdateSubject(message.jid, match);
      return await message.reply(`_Group name changed to "${match}"_`);
   }
);

command(
   {
      pattern: "groupdesc",
      fromMe: mode,
      desc: "Change the group description",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      if (!match) return await message.reply("_Provide a new group description_");

      await message.client.groupUpdateDescription(message.jid, match);
      return await message.reply("_Group description updated_");
   }
);

command(
   {
      pattern: "grouppic",
      fromMe: mode,
      desc: "Change the group profile picture",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      if (!message.reply_message || !message.reply_message.image) return await message.reply("_Reply to an image to set as group picture_");

      const media = await message.reply_message.download();
      await message.client.updateProfilePicture(message.jid, media);
      return await message.reply("_Group picture updated_");
   }
);

command(
   {
      pattern: "revoke",
      fromMe: mode,
      desc: "Revoke group invite link",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      await message.client.groupRevokeInvite(message.jid);
      return await message.reply("_Group invite link revoked_");
   }
);

command(
   {
      pattern: "invite",
      fromMe: mode,
      desc: "Get group invite link",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const inviteCode = await message.client.groupInviteCode(message.jid);
      return await message.reply(`https://chat.whatsapp.com/${inviteCode}`);
   }
);

command(
   {
      pattern: "ginfo",
      fromMe: mode,
      desc: "Get detailed group information",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");

      const groupMetadata = await message.client.groupMetadata(message.jid);
      const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

      let info = `*Group Name:* ${groupMetadata.subject}\n`;
      info += `*Group ID:* ${groupMetadata.id}\n`;
      info += `*Created On:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}\n`;
      info += `*Created By:* @${groupMetadata.owner.split("@")[0]}\n`;
      info += `*Participant Count:* ${groupMetadata.participants.length}\n`;
      info += `*Admin Count:* ${admins.length}\n`;
      info += `*Description:* ${groupMetadata.desc || "No description"}\n`;

      return await message.reply(info, {
         mentions: [groupMetadata.owner, ...admins],
      });
   }
);

command(
   {
      pattern: "requests",
      fromMe: mode,
      desc: "View pending join requests",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const requests = await message.client.groupRequestParticipantsList(message.jid);
      if (requests.length === 0) return await message.reply("_No pending join requests_");

      let msg = "_Pending Join Requests:_\n\n";
      requests.forEach((request, index) => {
         msg += `${index + 1}. @${request.jid.split("@")[0]}\n`;
      });

      return await message.reply(msg, { mentions: requests.map(r => r.jid) });
   }
);

command(
   {
      pattern: "accept",
      fromMe: mode,
      desc: "Accept group join request(s)",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const requests = await message.client.groupRequestParticipantsList(message.jid);
      if (requests.length === 0) return await message.reply("_No pending join requests_");

      if (!match) return await message.reply("_Provide the number(s) of the request(s) to accept, separated by commas_");

      const indexes = match.split(",").map(num => parseInt(num.trim()) - 1);
      const validIndexes = indexes.filter(index => index >= 0 && index < requests.length);

      if (validIndexes.length === 0) return await message.reply("_Invalid request number(s)_");

      for (let index of validIndexes) {
         await message.client.groupRequestParticipantsUpdate(message.jid, [requests[index].jid], "accept");
      }

      return await message.reply(`_Accepted ${validIndexes.length} join request(s)_`);
   }
);

command(
   {
      pattern: "reject",
      fromMe: mode,
      desc: "Reject group join request(s)",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const requests = await message.client.groupRequestParticipantsList(message.jid);
      if (requests.length === 0) return await message.reply("_No pending join requests_");

      if (!match) return await message.reply("_Provide the number(s) of the request(s) to reject, separated by commas_");

      const indexes = match.split(",").map(num => parseInt(num.trim()) - 1);
      const validIndexes = indexes.filter(index => index >= 0 && index < requests.length);

      if (validIndexes.length === 0) return await message.reply("_Invalid request number(s)_");

      for (let index of validIndexes) {
         await message.client.groupRequestParticipantsUpdate(message.jid, [requests[index].jid], "reject");
      }

      return await message.reply(`_Rejected ${validIndexes.length} join request(s)_`);
   }
);

command(
   {
      pattern: "leave",
      fromMe: mode,
      desc: "Leave the group",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");

      await message.reply("_Goodbye! Leaving the group..._");
      return await message.client.groupLeave(message.jid);
   }
);

command(
   {
      pattern: "gcsets",
      fromMe: mode,
      desc: "Change group settings",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      if (!match) return await message.reply("_Provide a setting to change: 'announcement' or 'locked' or 'unlocked'_");

      let setting;
      if (match === "announcement") setting = "announcement";
      else if (match === "locked") setting = "locked";
      else if (match === "unlocked") setting = "unlocked";
      else return await message.reply("_Invalid setting. Use 'announcement', 'locked', or 'unlocked'_");

      await message.client.groupSettingUpdate(message.jid, setting);
      return await message.reply(`_Group settings updated to ${setting}_`);
   }
);

command(
   {
      pattern: "admins",
      fromMe: mode,
      desc: "Tag all group admins",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");

      const groupMetadata = await message.client.groupMetadata(message.jid);
      const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

      let msg = "_Group Admins:_\n\n";
      admins.forEach((admin, index) => {
         msg += `${index + 1}. @${admin.split("@")[0]}\n`;
      });

      return await message.reply(msg, { mentions: admins });
   }
);

command(
   {
      pattern: "gclink",
      fromMe: mode,
      desc: "Get or reset group invite link",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      if (match === "reset") {
         await message.client.groupRevokeInvite(message.jid);
         await message.reply("_Group invite link has been reset_");
      }

      const inviteCode = await message.client.groupInviteCode(message.jid);
      return await message.reply(`https://chat.whatsapp.com/${inviteCode}`);
   }
);

command(
   {
      pattern: "poll",
      fromMe: mode,
      desc: "Create a poll",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");

      const [question, ...options] = match.split("|").map(item => item.trim());
      if (!question || options.length < 2) return await message.reply("_Usage: .poll Question | Option1 | Option2 | ..._");

      const poll = {
         name: question,
         values: options,
         selectableCount: 1,
      };

      await message.client.sendMessage(message.jid, { poll });
   }
);

command(
   {
      pattern: "kickall",
      fromMe: mode,
      desc: "Kick all participants except admins and bot",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
      await message.reply("_This action will remove all non-admin participants from the group. Are you sure? Reply with 'yes' to confirm._");

      const confirmation = await message.client.waitForMessage(message.jid, message.sender, 30000);
      if (!confirmation || confirmation.text.toLowerCase() !== "yes") {
         return await message.reply("_Kickall command cancelled._");
      }

      const groupMetadata = await message.client.groupMetadata(message.jid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin).map(p => p.id);
      const botId = message.client.user.id.split(":")[0] + "@s.whatsapp.net";

      const toRemove = participants.filter(p => !p.admin && p.id !== botId).map(p => p.id);

      if (toRemove.length === 0) {
         return await message.reply("_No non-admin participants to remove._");
      }

      await message.reply(`_Removing ${toRemove.length} participants..._`);

      const batchSize = 5;
      for (let i = 0; i < toRemove.length; i += batchSize) {
         const batch = toRemove.slice(i, i + batchSize);
         await message.client.groupParticipantsUpdate(message.jid, batch, "remove");
         await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return await message.reply(`_Successfully removed ${toRemove.length} participants._`);
   }
);

command(
   {
      pattern: "antipromote",
      fromMe: mode,
      desc: "Toggle anti-promote feature",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const currentStatus = await getAntiPromote(message.jid);
      const newStatus = !currentStatus;
      await setAntiPromote(message.jid, newStatus);

      return await message.reply(`_Anti-promote has been ${newStatus ? "enabled" : "disabled"} for this group._`);
   }
);

command(
   {
      pattern: "antidemote",
      fromMe: mode,
      desc: "Toggle anti-demote feature",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");
      if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");

      const currentStatus = await getAntiDemote(message.jid);
      const newStatus = !currentStatus;
      await setAntiDemote(message.jid, newStatus);

      return await message.reply(`_Anti-demote has been ${newStatus ? "enabled" : "disabled"} for this group._`);
   }
);

command(
   {
      on: "group_update",
   },
   async message => {
      if (message.update === "promote" || message.update === "demote") {
         const groupJid = message.jid;
         const actor = message.actor;
         const participants = message.participants;

         if (message.update === "promote") {
            const antiPromoteEnabled = await getAntiPromote(groupJid);
            if (antiPromoteEnabled) {
               const botClient = message.client;
               const botIsAdmin = await isAdmin(groupJid, botClient.user.id.split(":")[0] + "@s.whatsapp.net", botClient);

               if (botIsAdmin) {
                  for (let participant of participants) {
                     await botClient.groupParticipantsUpdate(groupJid, [participant], "demote");
                  }
                  await message.reply(`_Unauthorized promotion detected. User(s) have been demoted._`);
               }
            }
         } else if (message.update === "demote") {
            const antiDemoteEnabled = await getAntiDemote(groupJid);
            if (antiDemoteEnabled) {
               const botClient = message.client;
               const botIsAdmin = await isAdmin(groupJid, botClient.user.id.split(":")[0] + "@s.whatsapp.net", botClient);

               if (botIsAdmin) {
                  for (let participant of participants) {
                     await botClient.groupParticipantsUpdate(groupJid, [participant], "promote");
                  }
                  await message.reply(`_Unauthorized demotion detected. User(s) have been re-promoted._`);
               }
            }
         }
      }
   }
);
command(
   {
      pattern: "strikes ?(.*)",
      fromMe: true,
      desc: "Check or reset user strikes",
      type: "group",
   },
   async (message, match) => {
      if (!message.isGroup) return await message.reply("_This command is for groups only_");

      const [action, mentionedJid] = match[1].split(" ");
      const userId = mentionedJid || (message.reply_message ? message.reply_message.sender : null);

      if (!userId) return await message.reply("_Please mention a user or reply to their message_");

      switch (action.toLowerCase()) {
         case "check":
            const strikes = await getStrikes(message.jid, userId);
            return await message.reply(`_User @${userId.split("@")[0]} has ${strikes} strike(s)._`);

         case "reset":
            await resetStrikes(message.jid, userId);
            return await message.reply(`_Strikes reset for user @${userId.split("@")[0]}._`);

         default:
            return await message.reply("_Invalid action. Use 'check' or 'reset'_");
      }
   }
);

const MAX_STRIKES = 3; // Number of strikes before action is taken

command(
   {
      on: "text",
      fromMe: false,
   },
   async message => {
      if (!message.isGroup) return; // Only check in groups

      const antiWords = await getAntiWords(message.jid);
      if (antiWords.length === 0) return;

      const lowerCaseMessage = message.text.toLowerCase();
      const containsAntiWord = antiWords.some(word => lowerCaseMessage.includes(word));

      if (containsAntiWord) {
         await message.delete();
         const strikes = await addStrike(message.jid, message.sender);

         if (strikes < MAX_STRIKES) {
            await message.reply(`_Warning: Your message was deleted because it contained a prohibited word. You have ${strikes} strike(s). At ${MAX_STRIKES} strikes, you will be removed from the group._`);
         } else {
            try {
               await message.client.groupParticipantsUpdate(message.jid, [message.sender], "remove");
               await message.reply(`_User @${message.sender.split("@")[0]} has been removed from the group for repeated violations._`);
            } catch (error) {
               console.error("Failed to remove user:", error);
               await message.reply("_Failed to remove user. Please ensure the bot has admin privileges._");
            }
            await resetStrikes(message.jid, message.sender);
         }
      }
   }
);
