const logger = require('pino')();
const { Topic } = require('../models/topic.model');
const events = require('../events');

const roundNuber = (value) => {
  if (isFinite(value)) {
    return Number(value);
  }
  return value;
};

events.subscribe('MESSAGE', (topic, value) => {
  Topic.findOneAndUpdate({ topic }, {
    $set: {
      lastValue: roundNuber(value),
    },
  }, {
    new: true,
  }).catch((err) => {
    logger.error(err);
  });
});
