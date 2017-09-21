const { Caiman } = require('caiman');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const config = require('../config');

moment().utcOffset(config.timeZoneOffset);

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

const topicsStatistic = {};

function initBD() {
  MongoClient.connect(config.mongodbUIR, (err, db) => {
    options.driver.options.db = db;
  });
}

function saveData(topic, value) {
  if (!topicsStatistic[topic]) {
    topicsStatistic[topic] = new Caiman(topic, options);
  }

  const currentDate = new Date();
  topicsStatistic[topic].save(currentDate, PERIODS, value, STRATEGY);
}

function getTopicsStatistic() {
  return topicsStatistic;
}

module.exports = {
  initBD,
  saveData,
  getTopicsStatistic,
};
