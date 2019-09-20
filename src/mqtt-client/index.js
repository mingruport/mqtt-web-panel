const mqtt = require('mqtt');
const Topic = require('../models/topic.model');
const pubsub = require('../utils/pubsub');
const logger = require('../utils/logger');
const config = require('../config');

const mqttClient = mqtt.connect(config.mqttOptions);

const resubscribe = () => {
  Topic
    .find()
    .then(data => {
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

  pubsub.publish('NEW_MQTT_MESSAGE', { topic, message: message.toString() });
});

pubsub.subscribe('NEW_TOPIC', topic => {
  mqttClient.subscribe(topic, (err, granted) => {
    if (err) logger.error(err);
    logger.info('MQTT Subscribe -', granted);
  });
});

pubsub.subscribe('UPDATE_TOPIC', topic => {
  mqttClient.unsubscribe(topic, err => {
    if (err) logger.error(err);
    logger.info('MQTT Unsubscribe -', topic);
  });

  resubscribe();
});

pubsub.subscribe('DELETE_TOPIC', topic => {
  mqttClient.unsubscribe(topic, err => {
    if (err) logger.error(err);
    logger.info('MQTT Unsubscribe -', topic);
  });
});

module.exports = {
  resubscribe,
};