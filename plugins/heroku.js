const config = require("../config");
const { command } = require("../lib");
const fetch = require("node-fetch");

const appName = config.HEROKU_APP_NAME ? config.HEROKU_APP_NAME.toLowerCase() : "";
const authToken = config.HEROKU_API_KEY;
const HEROKU_ENABLED = !!(authToken && appName);

const updateConfig = () => {
 try {
  const configPath = "../config";
  delete require.cache[configPath];
  require(configPath);
  return true;
 } catch (error) {
  console.error(error);
 }
};

const heroku = {
 addVar: async (varName, varValue) => {
  try {
   const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
   };

   const response = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ [varName]: varValue }),
   });

   const result = await response.json();
   return { status: true, data: result };
  } catch (error) {
   return { status: false, data: error };
  }
 },

 getAllVars: async () => {
  try {
   const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${authToken}`,
   };

   const response = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { headers });
   const vars = await response.json();
   let varsMessage = `*_${appName} VARS_*`;

   Object.keys(vars).forEach(key => {
    varsMessage += `*${key} :*  ${vars[key] ? `\`\`\`${vars[key]}\`\`\`` : ""} \n`;
   });

   return { status: true, data: varsMessage };
  } catch (error) {
   return { status: false, data: error.message || error };
  }
 },

 getVar: async varName => {
  try {
   const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${authToken}`,
   };

   const response = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { headers });
   const vars = await response.json();
   return { status: true, data: vars[varName] };
  } catch (error) {
   return { status: false, data: error.message || error };
  }
 },

 setVar: async (varName, varValue) => {
  try {
   const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
   };

   const response = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { method: "GET", headers });
   if (!response.ok) return { status: false, data: "Variable not found in Heroku app" };

   const vars = await response.json();
   if (vars.hasOwnProperty(varName)) {
    vars[varName] = varValue;
    const updateResponse = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
     method: "PATCH",
     headers,
     body: JSON.stringify(vars),
    });

    if (updateResponse.ok) {
     return { status: true, data: updateResponse };
    } else {
     return { status: false, data: `Failed to update app variable. Status: ${updateResponse.status}` };
    }
   } else {
    return { status: false, data: "Variable not found in app" };
   }
  } catch (error) {
   return { status: false, data: error.message || error };
  }
 },
};

command(
 {
  pattern: "getsudo",
  fromMe: true,
  type: "heroku",
 },
 async message => {
  const sudoList = config.SUDO.split(",")
   .filter(user => user && user !== "null")
   .map(user => user.trim());

  const sudoMessage = sudoList.map((user, index) => `  ${index + 1} 〄 @${user}\n\n`).join("");

  const mentions = [message.sender, ...sudoList.map(user => user + "@s.whatsapp.net")];

  if (!sudoMessage) {
   return await message.sendReply("*_NO SUDO NUMBERS_*");
  }

  const replyText = `\n*_SUDO NUMBERS_*\n${sudoMessage}`.trim();
  await message.sendFromUrl("https://telegra.ph/file/5fd51597b0270b8cff15b.png", {
   caption: replyText,
   mentions,
  });
 }
);
