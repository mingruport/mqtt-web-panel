require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodbUIR: process.env.MONGODB_URI,
  timeZone: process.env.TIME_ZONE || '00:00',
  mqttOptions: {
    host: process.env.MQTT_URL,
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  }
};
