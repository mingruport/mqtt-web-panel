const { getWidget, createEvent, updateWidget } = require('./widgets');
const pubsub = require('./utils/pubsub');
const logger = require('./utils/logger');

module.exports = () => {
  pubsub.subscribe('NEW_MQTT_MESSAGE', ({ topic, message }) => {
    getWidget({ topic })
      .then(widget => updateWidget(widget, { value: message }))
      .then(widget => createEvent({ widgetId: widget._id, value: message }))
      .catch(err => logger.error(err));
  });
};
