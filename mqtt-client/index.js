const mqtt = require('mqtt');
const logger = require('pino')();
const config = require('../config');
const { Topic } = require('../models/topic.model');
const timeseries = require('../utils/timeseries');

const events = require('../events');

const mqttClient = mqtt.connect(config.mqttOptions);

const resubscribe = () => {
  Topic.find()
    .then((data) => {
      if (data) {
        const topics = data.map(item => item.topic);

        mqttClient.subscribe(topics, (err, granted) => {
          if (err) logger.error(err);
          logger.info('MQTT Subscribe -', granted);
        });
      }
    })
    .catch(err => logger.error(err));
};

mqttClient.on('connect', () => {
  logger.info('MQTT Client ID -', mqttClient.options.clientId);
  resubscribe();
});

mqttClient.on('error', error => logger.error(error));

mqttClient.on('message', (topic, message) => {
  logger.info('MQTT message -', `${topic}: ${message}`);

  events.push('MESSAGE', topic.toString(), message.toString());
});

events.subscribe('NEW_TOPIC', topic => {
  mqttClient.subscribe(topic, (err, granted) => {
    if (err) logger.error(err);
    logger.info('MQTT Subscribe -', granted);
  });
});

events.subscribe('UPDATE_TOPIC', topic => {
  mqttClient.unsubscribe(topic, (err) => {
    if (err) logger.error(err);
    logger.info('MQTT Unsubscribe -', topic);
  });

  resubscribe();
});

events.subscribe('DELETE_TOPIC', topic => {
  mqttClient.unsubscribe(topic, (err) => {
    if (err) logger.error(err);
    logger.info('MQTT Unsubscribe -', topic);
  });
});

module.exports = {
  resubscribe,
};