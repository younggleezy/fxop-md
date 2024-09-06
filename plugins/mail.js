const { command, getBuffer, mode } = require("../lib");
const axios = require("axios");
const cheerio = require("cheerio");

let placeholderImageUrl = "https://telegra.ph/file/b8e96b599e0fa54d25940.jpg";
const emailDataStore = {};

command(
  {
    pattern: "tempmail",
    info: "Create temporary email address and use it as needed.",
    type: "mail",
  },
  async (context) => {
    try {
      const sender = context.sender;

      if (!emailDataStore[sender]) {
        const newEmailData = await tempmail.create();
        if (!newEmailData || !newEmailData[0]) {
          return await context.reply("Request Denied!");
        }

        const [login, domain] = newEmailData[0].split("@");
        emailDataStore[sender] = { email: newEmailData[0], login, domain };
      }

      let imageBuffer = false;
      try {
        imageBuffer = await getBuffer(placeholderImageUrl);
      } catch (error) {
        console.log(error);
      }

      const emailInfo = emailDataStore[sender];
      await context.send(
        `NEW MAIL\n\nEMAIL: ${emailInfo.email}\nLOGIN: ${emailInfo.login}\nADDRESS: ${emailInfo.domain}\n`,
      );
    } catch (error) {
      console.log(error);
      await context.reply("Request Denied!");
    }
  },
);

command(
  {
    pattern: "checkmail",
    type: "mail",
    info: "Check mails in your temporary email address.",
  },
  async (context) => {
    try {
      const sender = context.sender;
      const emailInfo = emailDataStore[sender];

      if (!emailInfo || !emailInfo.email) {
        return await context.send(`_You Didn't Create Any Mail_`);
      }

      const receivedMails = await tempmail.mails(
        emailInfo.login,
        emailInfo.domain,
      );
      if (!receivedMails || receivedMails.length === 0) {
        return await context.send(`_EMPTY ➪ No Mails Here_`);
      }

      let imageBuffer = false;
      try {
        imageBuffer = await getBuffer(placeholderImageUrl);
      } catch (error) {
        console.log(error);
      }

      for (const mail of receivedMails) {
        const emailContent = await tempmail.emailContent(
          emailInfo.login,
          emailInfo.domain,
          mail.id,
        );
        if (emailContent) {
          const mailInfo = `From ➪ ${mail.from}\nDate ➪ ${mail.date}\nEMAIL ID ➪ [${mail.id}]\nSubject ➪ ${mail.subject}\nContent ➪ ${emailContent}`;
          await context.send(mailInfo);
        }
      }
    } catch (error) {
      console.log(error);
      await context.reply("Request Denied!");
    }
  },
);

command(
  {
    pattern: "delmail",
    type: "mail",
    info: "Delete temporary email address.",
  },
  async (context) => {
    try {
      const sender = context.sender;
      if (emailDataStore[sender]) {
        delete emailDataStore[sender];
        await context.send("_Deleted the email address._");
      } else {
        await context.send("No email address to delete.");
      }
    } catch (error) {
      console.log(error);
      await context.reply("Request Denied!");
    }
  },
);

const tempmail = {
  create: async () => {
    const url =
      "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1";
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  mails: async (login, domain) => {
    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  emailContent: async (login, domain, id) => {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`;
    try {
      const response = await axios.get(url);
      const emailData = response.data;
      const htmlContent = emailData.htmlBody;
      console.log({ htmlContent });

      const $ = cheerio.load(htmlContent);
      const textContent = $.text();
      return textContent;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
