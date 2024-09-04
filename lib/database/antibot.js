const { DataTypes } = require('sequelize');
const config = require('../../config');

const antibotDb = config.DATABASE.define('antibot', {
  chatid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = antibotDb;
