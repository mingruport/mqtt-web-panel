const Topic = require('./models/topic.model');
const pubsub = require('./utils/pubsub');
const logger = require('./utils/logger');

module.exports = io => {
  logger.info(`WS ${io.id} connected.`);

  const newMessageHandler = pubsub.subscribe('NEW_MQTT_MESSAGE', ({ topic, message }) => {
    Topic
      .findByTopic(topic)
      .then(data => {
        const friendlyId = data.friendly.toLowerCase();
        const value = message.toString();
        const unit = data.unit;

        io.emit('updateValue', { friendlyId, message: { value, unit } });
      })
      .catch(err => logger.error(err));
  });

  io.on('disconnect', () => {
    logger.info('WS disconnect.');

    pubsub.unsubscribe('NEW_MQTT_MESSAGE', newMessageHandler);
  });
}
