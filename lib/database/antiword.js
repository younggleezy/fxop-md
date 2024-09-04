const { DataTypes } = require("sequelize");
const config = require("../../config");

const antiwordDb = config.DATABASE.define("antiword", {
 chatid: {
  type: DataTypes.STRING,
  allowNull: false,
  primaryKey: true,
 },
 word: {
  type: DataTypes.TEXT, // Use TEXT to store JSON string
  allowNull: false,
  defaultValue: JSON.stringify(["fuck"]), // Default value as JSON string
 },
 enabled: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
 },
 createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
 },
 updatedAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
 },
});

module.exports = antiwordDb;
