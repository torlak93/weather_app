const express = require('express');
const db = require('../../src/database/database');
const Metrics = require('../models/metrics');
const moment = require('moment');

const Statistics = express.Router();

Statistics.get('/today-statistics', async (req, res) => {
  try {
    const today = new Date();

    const startDay = today.toISOString().split('T')[0];
    const endDay = today.toISOString().split('T')[0].concat('T23:59:59.000');


    const query = await db.query(`
      SELECT ROUND(AVG(meantemp), 2) as avg_temp, ROUND(MAX(meantemp)) as max_temp, 
        ROUND(MAX(wind_speed)) as max_wind, ROUND(MAX(humidity)) as max_humidity, ROUND(AVG(meanpressure), 2) as avg_meanpressure
      FROM metrics
      WHERE date < '${endDay}' AND date >= '${startDay}'
    `);

    res.send(query[0]);
  } catch (e) {}
});

Statistics.get('/forecast', async (req, res) => {
  try {
    let { time, to, from, isGapfill, measure, measureType, location } =
      req.query;
    // type - min, max, avg
    // measure - meantemp, humidity ....
    const bucket = isGapfill ? 'time_bucket_gapfill' : 'time_bucket';

    measureType = 'AVG';
    const isGlobal = !!(location && location === 'global');
    if (isGlobal) {
      const query = await db.query(`
      SELECT ${bucket}('${time}', date) as name, ${measureType}(${measure}) as value
      FROM metrics 
      WHERE date > '${from}' AND date < '${to}'
      GROUP BY name
      ORDER BY name
      `);
      let data = query[0].map((row) => {
        row.name = moment(row.name).format('lll');

        return row;
      });

      data = data.map((row) => {
        row.value = row.value || 0;

        return row;
      });

      const finalData = [
        {
          name: measure,
          series: data,
        },
      ];

      res.send(finalData);
    } else {
      const query = await db.query(`
        SELECT ${bucket}('${time}', date) as timestamp, ${measureType}(${measure}) as measure, locations.name
        FROM metrics 
        JOIN locations
        ON metrics.locationId = locations.id
        WHERE date > '${from}' AND date < '${to}' ${
        location !== '' ? ' AND locations.id = ' + location : ''
      }
        GROUP BY timestamp, locations.id 
        ORDER BY timestamp
      `);

      const data = query[0].reduce((acc, row) => {
        const { timestamp, measure, name } = row;

        let series = acc.find((item) => item.name === name);
        if (!series) {
          series = {
            name: name,
            series: [],
          };
          acc.push(series);
        }

        series.series.push({
          value: measure || 0,
          name: moment(timestamp).format('lll'),
        });

        return acc;
      }, []);

      res.send(data);
    }
  } catch (e) {
    console.log('Error', e);
  }
});

// max temp u zadnjih mesec dana, na svakih 1h.. ali locf
Statistics.get('/locf', async (req, res) => {
  try {
    let { time, to, from, measure, location } = req.query;

    const isGlobal = !!(location && location === 'global');
    if (isGlobal) {
      const query = await db.query(`
        SELECT time_bucket_gapfill('${time}', date) as name, locf(AVG(${measure})) as value
        FROM metrics
        WHERE date > '${from}' AND date < '${to}' 
        GROUP BY name
        ORDER BY name
      `);

      let data = query[0].map((row) => {
        row.name = moment(row.name).format('lll');

        return row;
      });

      data = data.map((row) => {
        row.value = row.value || 0;

        return row;
      });

      const finalData = [
        {
          name: measure,
          series: data,
        },
      ];

      res.send(finalData);
    } else {
      const query = await db.query(`
        SELECT time_bucket_gapfill('${time}', date) as timestamp, locf(AVG(${measure})) as measure, locations.name
        FROM metrics
        JOIN locations
        ON metrics.locationId = locations.id
        WHERE date > '${from}' AND date < '${to}' ${
        location !== '' ? ' AND locations.id = ' + location : ''
      }
        GROUP BY timestamp, locations.id 
        ORDER BY timestamp
      `);

      const data = query[0].reduce((acc, row) => {
        const { timestamp, measure, name } = row;

        let series = acc.find((item) => item.name === name);
        if (!series) {
          series = {
            name: name,
            series: [],
          };
          acc.push(series);
        }

        series.series.push({
          value: measure || 0,
          name: moment(timestamp).format('lll'),
        });

        return acc;
      }, []);

      res.send(data);
    }
  } catch (e) {}
});

// /last-measurements
Statistics.get('/forecast-first-last', async (req, res) => {
  try {
    const { time, to, from, isGapfill, measure, measureType, location } =
      req.query;
    // type - first, last
    // measure - meantemp, humidity ....
    const bucket = isGapfill ? 'time_bucket_gapfill' : 'time_bucket';

    const isGlobal = !!(location && location === 'global');
    if (isGlobal) {
      const query = await db.query(`
        SELECT ${bucket}('${time}', date) as name, ${measureType}(${measure}, date) as value
        FROM metrics 
        WHERE date > '${from}' AND date < '${to}' 
        GROUP BY name 
        ORDER BY name
      `);

      let data = query[0].map((row) => {
        row.name = moment(row.name).format('lll');

        return row;
      });

      data = data.map((row) => {
        row.value = row.value || 0;

        return row;
      });

      const finalData = [
        {
          name: measure,
          series: data,
        },
      ];

      res.send(finalData);
    } else {
      const query = await db.query(`
        SELECT ${bucket}('${time}', date) as timestamp, ${measureType}(${measure}, date) as measure, locations.name
        FROM metrics 
        JOIN locations
        ON metrics.locationId = locations.id
        WHERE date > '${from}' AND date < '${to}' ${
        location !== '' ? ' AND locations.id = ' + location : ''
      }
        GROUP BY timestamp, locations.id
        ORDER BY timestamp
      `);

      const data = query[0].reduce((acc, row) => {
        const { timestamp, measure, name } = row;

        let series = acc.find((item) => item.name === name);
        if (!series) {
          series = {
            name: name,
            series: [],
          };
          acc.push(series);
        }

        series.series.push({
          value: measure || 0,
          name: moment(timestamp).format('lll'),
        });

        return acc;
      }, []);

      res.send(data);
    }
  } catch (e) {
    console.log('Error', e);
  }
});
/**
 * 2012-01-02
 * yyyy-mm-dd
 */

Statistics.get('/last-forecast', async (req, res) => {
  try {
    const query = await db.query(`
      SELECT *
      FROM metrics
      JOIN locations
      ON metrics.locationId = locations.id
      ORDER BY date DESC
      limit 10
    `);

    res.send(query[0]);
  } catch (e) {}
});

Statistics.get('/count-days', async (req, res) => {
  let { temp, to, from } = req.query;

  try {
    const query = await db.query(`
      SELECT DISTINCT (SELECT COUNT(*) as above FROM metrics WHERE meantemp >= ${temp} AND date >= '${from}' AND date <= '${to}'), (SELECT COUNT(*) as below FROM metrics WHERE meantemp <= ${temp} AND date >= '${from}' AND date <= '${to}')
      FROM metrics
    `);

    res.send(query[0]);
  } catch (e) {}
});

Statistics.get('/min-max-temperature', async (req, res) => {
  let { type } = req.query;

  try {
    const query = await db.query(`
      SELECT time_bucket('1 year', date) as interval, MAX(${type}), MIN(${type})
      FROM metrics
      GROUP BY interval
      ORDER BY interval ASC
    `);

    res.send(query[0]);
  } catch (e) {}
});

Statistics.post('/forecast', async (req, res) => {
  try {
    // await Temperature.create(req.body);

    const query = await db.query(`
      INSERT INTO metrics ("date","meantemp","humidity","wind_speed","meanpressure") VALUES ('${req.body['date']}',${req.body['meantemp']},${req.body['humidity']},${req.body['wind_speed']},${req.body['meanpressure']})
    `);

    res.json({
      message: 'New Data Created',
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Statistics;
