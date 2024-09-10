const { DataTypes } = require("sequelize");
const { proto } = require("baileys");
const { initAuthCreds } = require("baileys");

const Auth = sequelize.define("Auth", {
   key: {
      type: DataTypes.STRING,
      primaryKey: true,
   },
   value: {
      type: DataTypes.TEXT,
   },
});

const useCustomAuthState = async () => {
   const writeData = async (data, file) => {
      await Auth.upsert({
         key: file,
         value: JSON.stringify(data),
      });
   };

   const readData = async file => {
      const data = await Auth.findByPk(file);
      return data ? JSON.parse(data.value) : null;
   };

   const removeData = async file => {
      await Auth.destroy({ where: { key: file } });
   };

   const creds = (await readData("creds.json")) || initAuthCreds();

   return {
      state: {
         creds,
         keys: {
            get: async (type, ids) => {
               const data = {};
               await Promise.all(
                  ids.map(async id => {
                     let value = await readData(`${type}-${id}.json`);
                     if (type === "app-state-sync-key" && value) {
                        value = proto.AppStateSyncKeyData.fromObject(value);
                     }
                     data[id] = value;
                  })
               );
               return data;
            },
            set: async data => {
               const tasks = [];
               for (const category in data) {
                  for (const id in data[category]) {
                     const value = data[category][id];
                     const file = `${category}-${id}.json`;
                     tasks.push(value ? writeData(value, file) : removeData(file));
                  }
               }
               await Promise.all(tasks);
            },
         },
      },
      saveCreds: async () => {
         await writeData(creds, "creds.json");
      },
   };
};

module.exports = useCustomAuthState;
