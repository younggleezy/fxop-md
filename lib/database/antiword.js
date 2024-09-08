const config = require("../../config");
const { DataTypes } = require("sequelize");

const StrikeDB = config.DATABASE.define("Strike", {
   chat: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   user: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   strikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
   },
});

async function addStrike(jid, userId) {
   const [strike, created] = await StrikeDB.findOrCreate({
      where: { chat: jid, user: userId },
      defaults: { strikes: 1 },
   });

   if (!created) {
      await strike.increment("strikes");
      await strike.reload();
   }

   return strike.strikes;
}

async function resetStrikes(jid, userId) {
   await StrikeDB.destroy({
      where: { chat: jid, user: userId },
   });
}

async function getStrikes(jid, userId) {
   const strike = await StrikeDB.findOne({
      where: { chat: jid, user: userId },
   });

   return strike ? strike.strikes : 0;
}

module.exports = {
   StrikeDB,
   addStrike,
   resetStrikes,
   getStrikes,
};
