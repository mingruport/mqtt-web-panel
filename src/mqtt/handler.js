const mqtt = require('mqtt');

const pubsub = require('../utils/pubsub');
const logger = require('../utils/logger');

module.exports = (brokerOptions, topics = {}) => {
  const mqttClient = mqtt.connect(brokerOptions);

  mqttClient.on('connect', () => {
    logger.info(`MQTT Client ID - ${mqttClient.options.clientId}`);

    mqttClient.subscribe(topics, (err) => {
      if (err) logger.error(err);
    });
  });

  mqttClient.on('error', error => logger.error(error));

  mqttClient.on('message', (topic, message) => {
    logger.info('MQTT message -', `${topic}: ${message}`);

    pubsub.publish('NEW_MQTT_MESSAGE', { topic, message: message.toString() });
  });

  pubsub.subscribe('NEW_WIDGET', topic => {
    mqttClient.subscribe(topic, (err) => {
      if (err) logger.error(err);
      logger.info(`MQTT Subscribe - ${topic}`);
    });
  });

  pubsub.subscribe('UPDATE_WIDGET', ({ oldTopic, newTopic }) => {
    mqttClient.unsubscribe(oldTopic, err => {
      if (err) logger.error(err);
      logger.info(`MQTT Unsubscribe - ${oldTopic}`);
    });

    mqttClient.subscribe(newTopic, (err) => {
      if (err) logger.error(err);
      logger.info(`MQTT Subscribe - ${newTopic}`);
    });
  });

  pubsub.subscribe('DELETE_WIDGET', topic => {
    mqttClient.unsubscribe(topic, err => {
      if (err) logger.error(err);
      logger.info(`MQTT Unsubscribe - ${topic}`);
    });
  });
};
