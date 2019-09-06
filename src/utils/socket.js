const Topic = require('../models/topic.model');
const pubsub = require('./pubsub');
const logger = require('./logger');

const roundNuber = value => {
  if (isFinite(value)) return Number(value);
  return value;
};

module.exports = io => {
  logger.info('WS connected.');

  pubsub.subscribe('NEW_MESSAGE', (topic, value) => {
    Topic
      .findByTopic(topic)
      .then(topicData => {
        const friendlyId = topicData.friendly.toLowerCase();
        const message = {
          value: roundNuber(value).toString(),
          unit: topicData.unit
        };

        io.emit('updateValue', { friendlyId, message });
      })
      .catch(err => logger.error(err));
  });

  pubsub.subscribe('NEW_TOPIC', () => io.emit('updateTopics'));

  pubsub.subscribe('UPDATE_TOPIC', () => io.emit('updateTopics'));

  pubsub.subscribe('DELETE_TOPIC', () => io.emit('updateTopics'));
}
