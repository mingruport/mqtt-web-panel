const dotenv = require('dotenv').config();

const config = {};

config.port = process.env.PORT || 3000;
config.mongodbUIR = process.env.MONGOHQ_URL;

config.mqttOptions = {
  host: process.env.MQTT_URL,
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

config.timeZoneOffset = process.env.TIME_ZONE || '00:00';

module.exports = config;
