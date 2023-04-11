const Sequelize = require("sequelize");
const db = require('../database/database');

module.exports = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: 'false',
  // If don't want createdAt
  createdAt: false,

  // If don't want updatedAt
  updatedAt: false
})