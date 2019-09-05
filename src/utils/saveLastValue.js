const Topic = require('../models/topic.model');
const pubsub = require('../utils/pubsub');
const logger = require('../utils/logger');

pubsub.subscribe('MESSAGE', (topic, value) => {
  const lastValue = roundNuber(value);

  Topic
    .findOneAndUpdate({ topic }, { $set: { lastValue } }, { new: true })
    .catch(err => logger.error(err));
});

const roundNuber = value => {
  if (isFinite(value)) return Number(value);

  return value;
};
