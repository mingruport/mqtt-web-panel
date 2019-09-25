const { getWidget } = require('./widgets');
const pubsub = require('./utils/pubsub');
const logger = require('./utils/logger');

module.exports = io => {
  logger.info(`WS ${io.id} connected.`);

  const newMessageHandler = pubsub.subscribe('NEW_MQTT_MESSAGE', ({ topic, message }) => {
    const value = message.toString();

    getWidget({ topic })
      .then(widget => {
        const widgetId = widget._id;
        const unit = widget.unit;
        io.emit('updateValue', { id: widgetId, message: { value, unit } });
      })
      .catch(err => logger.error(err));
  });

  io.on('disconnect', () => {
    logger.info('WS disconnect.');

    pubsub.unsubscribe('NEW_MQTT_MESSAGE', newMessageHandler);
  });
}
