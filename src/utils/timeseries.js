const { Caiman } = require('caiman');
const { MongoClient } = require('mongodb');
const pubsub = require('../utils/pubsub');
const config = require('../config');

const PERIODS = ['month', 'day', 'hour', 'minute', 'second'];
const STRATEGY = 'averages';

const options = {
  driver: {
    type: 'mongodb',
    options: {
      collection: 'timeseries',
    },
  },
};

const topicStatistic = {};

const initBD = () => {
  MongoClient.connect(config.mongodbUIR, (err, db) => {
    options.driver.options.db = db;
  });
};

const getTopicStatistic = () => topicStatistic;

pubsub.subscribe('NEW_MQTT_MESSAGE', ({ topic, message }) => {
  if (!topicStatistic[topic]) {
    topicStatistic[topic] = new Caiman(topic, options);
  }

  const currentDate = new Date();
  topicStatistic[topic].save(currentDate, PERIODS, message, STRATEGY);
});

module.exports = {
  initBD,
  getTopicStatistic,
};
