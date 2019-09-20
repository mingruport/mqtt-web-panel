const Topic = require('../models/topic.model');
const pubsub = require('../utils/pubsub');
const logger = require('../utils/logger');

pubsub.subscribe('NEW_MQTT_MESSAGE', ({ topic, message }) => {
  Topic
    .findOneAndUpdate({ topic }, { $set: { lastValue: message } }, { new: true })
    .catch(err => logger.error(err));
});