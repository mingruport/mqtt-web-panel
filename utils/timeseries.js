const { Caiman } = require('caiman');
const { MongoClient } = require('mongodb');
const config = require('../config');
const events = require('../events');

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

events.subscribe('MESSAGE', (topic, value) => {
  if (!topicStatistic[topic]) {
    topicStatistic[topic] = new Caiman(topic, options);
  }

  const currentDate = new Date();
  topicStatistic[topic].save(currentDate, PERIODS, value, STRATEGY);
});

module.exports = {
  initBD,
  getTopicStatistic,
};
