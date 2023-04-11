const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'postgres://postgres:qwer1234@localhost:5432/delhi_timestamp',
  {
    dialect: 'postgres',
    protocol: 'postgres',
  }
);

module.exports = sequelize;
global.sequelize = sequelize;
