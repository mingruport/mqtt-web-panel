const express = require('express');
const moment = require('moment');
const Topic = require('../models/topic.model');
const errors = require('../utils/errors');
const timeseries = require('../utils/timeseries');
const config = require('../config');

const router = express.Router();

const CHILD_PERIODS = {
  hour: 'minute',
  day: 'hour',
  month: 'day',
};

const MOMENT_FORMATS = {
  hour: 'HH:mm',
  day: 'Do, HH:mm',
  month: 'MMM, Do',
};

/** GET api/timeseries - Get statistics data */
router.get('/', (req, res, next) => {
  const { friendlyId, period } = req.query;

  if (!period || !CHILD_PERIODS.hasOwnProperty(period)) {
    return next(new errors.BadRequestError('Period is not provided to wrong'));
  }

  if (!friendlyId) {
    return next(new errors.BadRequestError('Friendly ID is not provided'));
  }

  Topic
    .findByFriendlyId(friendlyId)
    .then(result => {
      if (!result) return Promise.reject(new errors.NotFoundError());

      const topics = timeseries.getTopicStatistic();
      const date = moment().subtract(1, period).toDate();

      if (!topics[result.topic]) return Promise.reject(new errors.BadRequestError(`${result.friendly} not contain statistics data`));

      return topics[result.topic].getCollection(date, CHILD_PERIODS[period]).toArray();
    })
    .then(statisticsData => {
      res.json({
        date: statisticsData.map(item => moment(item.startDate).utcOffset(config.timeZone).format(MOMENT_FORMATS[period])),
        value: statisticsData.map(item => item.data.average.toFixed(2)),
      });
    })
    .catch(err => next(err));
});

module.exports = router;
