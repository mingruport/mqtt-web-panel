const logger = require('pino')();
const { Topic } = require('../models/topic.model');
const inputStream = require('../data-streams/input');

const roundNuber = (value) => {
  if (isFinite(value)) {
    return Number(value);
  }
  return value;
};

inputStream.subscribe('message', (topic, value) => {
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
