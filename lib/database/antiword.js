const { DataTypes } = require("sequelize");
const config = require("../../config");

const antiwordDb = config.DATABASE.define("antiword", {
 chatid: {
  type: DataTypes.STRING,
  allowNull: false,
  primaryKey: true,
 },
 word: {
  type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: false,
  defaultValue: ["fuck"],
 },
 enabled: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
 },
});

module.exports = antiwordDb;
