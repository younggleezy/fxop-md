const config = require("../../config");
const { DataTypes } = require("sequelize");

const AntiWordDB = config.DATABASE.define("AntiWord", {
 chat: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 word: {
  type: DataTypes.STRING,
  allowNull: false,
 },
});

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

async function addAntiWord(jid = null, word = null) {
 return await AntiWordDB.create({ chat: jid, word: word.toLowerCase() });
}

async function removeAntiWord(jid = null, word = null) {
 return await AntiWordDB.destroy({
  where: {
   chat: jid,
   word: word.toLowerCase(),
  },
 });
}

async function getAntiWords(jid = null) {
 const words = await AntiWordDB.findAll({
  where: {
   chat: jid,
  },
 });

 return words.map(w => w.word);
}

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
 AntiWordDB,
 StrikeDB,
 addAntiWord,
 removeAntiWord,
 getAntiWords,
 addStrike,
 resetStrikes,
 getStrikes,
};
