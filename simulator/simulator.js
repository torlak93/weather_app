const { Client } = require('pg');

// Set up database connection
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'qwer1234',
  database: 'delhi_timestamp'
});

// Connect to the database
client.connect();

// function to generate sensor data
function generateSensorData(locationId) {
	const humidity = Math.round(Math.floor(Math.random() * 25) + 35); // 35 - 60 
  const meanpressure = Math.round(Math.floor(Math.random() * 100) + 900); // 900 - 1000
  const meantemp = Math.round(Math.floor(Math.random() * 20) + 17); // 17 - 37
  const wind_speed = Math.round(Math.floor(Math.random() * 10) + 2);
	const date = new Date();

  return {
    locationId: locationId,
    meantemp,
    humidity,
    wind_speed,
	  meanpressure,
    date
  };
}

// function to insert sensor data into database
async function insertSensorData(data) {
  const insertQuery = `
    INSERT INTO metrics("date","meantemp","humidity","wind_speed","meanpressure", "locationid")
    VALUES($1, $2, $3, $4, $5, $6)
  `;
  const values = [data.date, data.meantemp, data.humidity, data.wind_speed, data.meanpressure, data.locationId];

  try {
    await client.query(insertQuery, values);
  } catch (error) { }
}

// Define array of sensor IDs
const sensorIds = [1, 2, 3, 4];

// Generate and insert sensor data every 3 seconds
setInterval(() => {
  for (const sensorId of sensorIds) {
    const data = generateSensorData(sensorId);
    insertSensorData(data);
  }
}, 3000);
