const Sequelize = require('sequelize');

const Metrics = sequelize.define(
  'metrics',
  {
    date: Sequelize.DATE,
    meantemp: Sequelize.DATE,
    humidity: Sequelize.NUMBER,
    wind_speed: Sequelize.NUMBER,
    meanpressure: Sequelize.NUMBER,
  },
  {
    timestamps: 'false',
    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
  }
);

Metrics.removeAttribute('id');

module.exports = Metrics;
