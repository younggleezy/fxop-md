const { command, Ephoto360API, mode } = require("../lib");
command(
  {
    pattern: "ep1",
    fromMe: mode,
    desc: "Logo Maker",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.glossysilver(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʟᴏssʏ sɪʟᴠᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep2",
    fromMe: mode,
    desc: "Write Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.writetext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴡʀɪᴛᴇ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep3",
    fromMe: mode,
    desc: "Blackpink Logo",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.blackpinklogo(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʙʟᴀᴄᴋᴘɪɴᴋ ʟᴏɢᴏ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep4",
    fromMe: mode,
    desc: "Glitch Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.glitchtext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʟɪᴛᴄʜ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep5",
    fromMe: mode,
    desc: "Advanced Glow",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.advancedglow(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴀᴅᴠᴀɴᴄᴇᴅ ɢʟᴏᴡ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep6",
    fromMe: mode,
    desc: "Typography Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.typographytext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴛʏᴘᴏɢʀᴀᴘʜʏ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep7",
    fromMe: mode,
    desc: "Pixel Glitch",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.pixelglitch(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴘɪxᴇʟ ɢʟɪᴛᴄʜ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep8",
    fromMe: mode,
    desc: "Neon Glitch",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.neonglitch(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɴᴇᴏɴ ɢʟɪᴛᴄʜ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep9",
    fromMe: mode,
    desc: "Nigerian Flag",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.nigerianflag(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɴɪɢᴇʀɪᴀɴ ꜰʟᴀɢ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep10",
    fromMe: mode,
    desc: "American Flag",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.americanflag(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴀᴍᴇʀɪᴄᴀɴ ꜰʟᴀɢ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep11",
    fromMe: mode,
    desc: "Deleting Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.deletingtext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴅᴇʟᴇᴛɪɴɢ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep12",
    fromMe: mode,
    desc: "Blackpink Style",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.blackpinkstyle(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʙʟᴀᴄᴋᴘɪɴᴋ ꜱᴛʏʟᴇ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep13",
    fromMe: mode,
    desc: "Glowing Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.glowingtext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʟᴏᴡɪɴɢ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep14",
    fromMe: mode,
    desc: "Underwater",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.underwater(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴜɴᴅᴇʀᴡᴀᴛᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep15",
    fromMe: mode,
    desc: "Logo Maker",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.logomaker(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʟᴏɢᴏ ᴍᴀᴋᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep16",
    fromMe: mode,
    desc: "Cartoon Style",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.cartoonstyle(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴄᴀʀᴛᴏᴏɴ ꜱᴛʏʟᴇ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep17",
    fromMe: mode,
    desc: "Paper Cut",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.papercut(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴘᴀᴘᴇʀ ᴄᴜᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep18",
    fromMe: mode,
    desc: "Watercolor",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.watercolor(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴡᴀᴛᴇʀᴄᴏʟᴏʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep19",
    fromMe: mode,
    desc: "Effect Clouds",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.effectclouds(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴇꜰꜰᴇᴄᴛ ᴄʟᴏᴜᴅꜱ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep20",
    fromMe: mode,
    desc: "Gradient Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.gradienttext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʀᴀᴅɪᴇɴᴛ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep21",
    fromMe: mode,
    desc: "Summer Beach",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.summerbeach(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ꜱᴜᴍᴍᴇʀ ʙᴇᴀᴄʜ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep22",
    fromMe: mode,
    desc: "Luxury Gold",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.luxurygold(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʟᴜxᴜʀʏ ɢᴏʟᴅ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep23",
    fromMe: mode,
    desc: "Multicolored",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.multicolored(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴍᴜʟᴛɪᴄᴏʟᴏʀᴇᴅ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep24",
    fromMe: mode,
    desc: "Sand Summer",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.sandsummer(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ꜱᴀɴᴅ ꜱᴜᴍᴍᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep25",
    fromMe: mode,
    desc: "Sandsummer",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.sandsummer(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ꜱᴀɴᴅsᴜᴍᴍᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep26",
    fromMe: mode,
    desc: "Galaxy",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.galaxy(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢᴀʟᴀxʏ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep27",
    fromMe: mode,
    desc: "Nineteen Seventeen",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.nineteenseventeen(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "1𝟗𝟏𝟕",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep28",
    fromMe: mode,
    desc: "Making Neon",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.makingneon(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴍᴀᴋɪɴɢ ɴᴇᴏɴ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep29",
    fromMe: mode,
    desc: "Text Effect",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.texteffect(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴛᴇxᴛ ᴇꜰꜰᴇᴄᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep30",
    fromMe: mode,
    desc: "Galaxy Style",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.galaxystyle(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢᴀlᴀxʏ ꜱᴛʏʟᴇ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep31",
    fromMe: mode,
    desc: "Blackpink Style",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.blackpinkstyle(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʙʟᴀᴄᴋᴘɪɴᴋ ꜱᴛʏʟᴇ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep32",
    fromMe: mode,
    desc: "Glowing Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.glowingtext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʟᴏᴡɪɴɢ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep33",
    fromMe: mode,
    desc: "Advanced Glow",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.advancedglow(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴀᴅᴠᴀɴᴄᴇᴅ ɢʟᴏᴡ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep34",
    fromMe: mode,
    desc: "Glossy Silver",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.glossysilver(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ɢʟᴏssʏ ꜱɪʟᴠᴇʀ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep35",
    fromMe: mode,
    desc: "Writing Text",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.writetext(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ᴡʀɪᴛɪɴɢ ᴛᴇxᴛ",
        },
      },
    });
  },
);

command(
  {
    pattern: "ep36",
    fromMe: mode,
    desc: "Blackpink Logo",
    type: "eps",
  },
  async (m, match) => {
    if (!match) return await m.sendReply("_Give Me Text_");
    await m.sendReply("_Creating Design_");
    const logo = new Ephoto360API();
    const img = await logo.blackpinklogo(match);
    return m.send(img, {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363327841612745@newsletter",
          newsletterName: "ʙʟᴀᴄᴋᴘɪɴᴋ ʟᴏɢᴏ",
        },
      },
    });
  },
);
