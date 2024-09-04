const { DataTypes } = require("sequelize");
const config = require("../../config");

const antilinkDb = config.DATABASE.define("antilink", {
 chatid: {
  type: DataTypes.STRING,
  allowNull: false,
  primaryKey: true,
 },
 allowed: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "gist.github.com",
 },
 enabled: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
 },
 action: {
  type: DataTypes.ENUM("kick", "warn", "delete", "null"),
  allowNull: false,
  defaultValue: "kick",
 },
});

module.exports = antilinkDb;
