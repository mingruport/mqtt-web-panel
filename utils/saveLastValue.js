const logger = require('winston');
const { Topic } = require('../models/topic');

const roundNuber = (value) => {
  if (isFinite(value)) {
    return Number(value);
  }
  return value;
};

module.exports = (topic, value) => {
  Topic.findOneAndUpdate({ topic }, {
    $set: {
      lastValue: roundNuber(value.toString()),
    },
  }, {
    new: true,
  }).catch((err) => {
    logger.error(err);
  });
};
