const config = {};

const mqttURL = process.env.MQTT_URL;
const mqttPort = process.env.MQTT_PORT;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

config.port = process.env.PORT || 3000;
config.mongodbUIR = process.env.MONGOHQ_URL;

config.timeZoneOffset = process.env.TIME_ZONE || '00:00';

config.mqttOptions = {
  host: mqttURL,
  port: mqttPort,
  username: mqttUsername,
  password: mqttPassword,
};

module.exports = config;
