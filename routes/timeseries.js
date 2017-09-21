const express = require('express');
const moment = require('moment');
const { Topic } = require('../models/topic');
const config = require('../config');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');
const timeseries = require('../utils/timeseries');

const router = express.Router();

moment().utcOffset(config.timeZoneOffset);

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

/** GET /timeseries - Get statistics data */
router.get('/', (req, res, next) => {
  const { friendlyId, period } = req.query;

  if (!period || !CHILD_PERIODS.hasOwnProperty(period)) {
    return next(new APIError('Period is not provided to wrong', httpStatus.BAD_REQUEST, true));
  }

  if (!friendlyId) {
    return next(new APIError('Friendly ID is not provided', httpStatus.BAD_REQUEST, true));
  }

  Topic.findByFriendlyId(friendlyId).then((result) => {
    if (!result) {
      return next(new APIError('Not found', httpStatus.NOT_FOUND, true));
    }

    const topics = timeseries.getTopicsStatistic();
    const date = moment().subtract(1, period).toDate();

    if (!topics[result.topic]) {
      return next(new APIError(`${result.friendly} not contain statistics data`, httpStatus.BAD_REQUEST, true));
    }

    topics[result.topic].getCollection(date, CHILD_PERIODS[period]).toArray().then((statisticsData) => {
      res.json({
        date: statisticsData.map(item => moment(item.startDate).format(MOMENT_FORMATS[period])),
        value: statisticsData.map(item => item.data.average.toFixed(2)),
      });
    }).catch(err => next(err));
  }).catch(err => next(err));
});

module.exports = router;
