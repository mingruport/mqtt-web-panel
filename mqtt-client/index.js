const mqtt = require('mqtt');
const logger = require('pino')();
const config = require('../config');
const { Topic } = require('../models/topic.model');
const saveLastValue = require('../utils/saveLastValue');
const timeseries = require('../utils/timeseries');
const socketio = require('../utils/socketio');

const mqttClient = mqtt.connect(config.mqttOptions);

const resubscribe = () => {
  Topic.find().then((data) => {
    if (data) {
      const topics = data.map(item => item.topic);

      mqttClient.subscribe(topics, (err, granted) => {
        if (err) logger.error(err);
        logger.info('MQTT Subscribe -', granted);
      });
    }
  }).catch((err) => {
    logger.error(err);
  });
};

const subscribe = (topic) => {
  mqttClient.subscribe(topic, (err, granted) => {
    if (err) logger.error(err);
    logger.info('MQTT Subscribe -', granted);
  });
};

const unsubscribe = (topic) => {
  mqttClient.unsubscribe(topic, (err) => {
    if (err) logger.error(err);
    logger.info('MQTT Unsubscribe -', topic);
  });
};

mqttClient.on('connect', () => {
  resubscribe();
  logger.info('MQTT Client ID -', mqttClient.options.clientId);
});

mqttClient.on('error', (error) => {
  logger.error(error);
});

mqttClient.on('message', (topic, message) => {
  logger.info('MQTT message -', `${topic}: ${message}`);

  saveLastValue(topic, message);
  timeseries.saveData(topic, message.toString());
  socketio.sendMessage(topic, message.toString());
});

module.exports = {
  resubscribe,
  subscribe,
  unsubscribe,
};
