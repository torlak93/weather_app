const express = require('express');
var cors = require('cors');
const amqp = require('amqplib');
const { Client } = require('pg');
const app = express();
const port = 5000;

const db = require('./src/database/database');

app.use(cors());

app.use(express.json());

//routes
const users = require('./src/routes/users');
app.use('/users', users);
const authRoute = require('./src/routes/auth');
app.use(authRoute);
const stats = require('./src/routes/statistics');
app.use(stats);
// consumeSensorData();

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const TIMESCALE_URL =
  'postgres://postgres:qwer1234@localhost:5432/delhi_timestamp';

async function insertData(client, data) {
  try {
    const insertQuery = `
    INSERT INTO metrics("date","meantemp","humidity","wind_speed","meanpressure", "locationid")
    VALUES($1, $2, $3, $4, $5, $6)
  `;
    const values = [
      data.date,
      data.meantemp,
      data.humidity,
      data.wind_speed,
      data.meanpressure,
      data.locationId,
    ];

    await client.query(insertQuery, values);
  } catch (err) {
    console.log(err);
  }
}

async function consumeSensorData() {
  try {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue('sensor_data');
    console.log('conn to rabbit')
    channel.consume('sensor_data', async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const client = new Client({ connectionString: TIMESCALE_URL });
      await client.connect();
      await insertData(client, data);
      await client.end();
      channel.ack(msg);
    });
  } catch (err) {
    console.log(err);
  }
}

