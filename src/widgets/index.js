const { sub: subDate, format: formatDate } = require('date-fns');

const Widget = require('./widget');
const Event = require('./event');
const pubsub = require('../utils/pubsub');
const { BadRequestError, NotFoundError } = require('../utils/errors');

const VALID_PERIODS = ['hour', 'day', 'month'];

const GROUP_EXPRESSION = {
  hour: { $minute: '$createdAt' },
  day: { $hour: '$createdAt' },
  month: { $dayOfMonth: '$createdAt' }
};

const EVENT_DATE_FORMAT = {
  hour: 'HH:mm',
  day: 'do, HH:mm',
  month: 'MMM, do',
};

const DURATION_MAP = {
  hour: { hours: 1 },
  day: { days: 1 },
  month: { months: 1 },
};

const allWidgets = () => Widget.find();

const getWidgetById = id => {
  return Widget
    .findById(id)
    .then(widget => {
      if (!widget) return Promise.reject(new NotFoundError());
      return widget;
    });
}

const getWidget = conditions => {
  return Widget
    .findOne(conditions)
    .then(widget => {
      if (!widget) return Promise.reject(new NotFoundError());
      return widget;
    });
}

const createWidget = data => {
  const widget = new Widget(data);

  return widget
    .save()
    .then(widget => {
      pubsub.publish('NEW_WIDGET', widget.topic);
      return widget;
    });
}

const updateWidget = (widget, data) => {
  const oldTopic = widget.topic;
  const oldQos = widget.qos;

  return widget
    .set(data)
    .save()
    .then(widget => {
      const newTopic = widget.topic;
      const newQos = widget.qos;

      if (isTopicUpdated(oldTopic, newTopic) || IsQosUpdated(oldQos, newQos)) {
        pubsub.publish('UPDATE_WIDGET', { oldTopic, newTopic: { [newTopic]: { qos: newQos } } });
      }

      return widget;
    });
}

const deleteWidget = widget => {
  return widget
    .remove()
    .then(widget => pubsub.publish('DELETE_WIDGET', widget.topic));
}

const allEventByWidget = (widgetId, period) => {
  if (!period || !isValidPeriod(period)) {
    return new BadRequestError('Period has an invalid entry');
  }

  const endDate = getEndDate(period);

  return Event
    .aggregate([
      {
        $match: {
          widgetId: widgetId,
          createdAt: { $gte: endDate },
        },
      },
      {
        $group: {
          '_id': GROUP_EXPRESSION[period],
          average: { $avg: '$value' },
          date: { $first: '$createdAt' },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          _id: 0,
          date: '$date',
          value: '$average'
        },
      },
    ])
    .then(events => fromatEvents(events, period));
};

const createEvent = data => {
  const event = new Event(data);

  return event.save();
}

const isTopicUpdated = (oldTopic, newTopic) => oldTopic !== newTopic;

const IsQosUpdated = (oldQos, newQos) => oldQos !== newQos;

const isValidPeriod = period => VALID_PERIODS.includes(period);

const getEndDate = period => subDate(new Date(), DURATION_MAP[period]);

const fromatEvents = (events, period) => {
  const date = events.map(event => formatDate(event.date, EVENT_DATE_FORMAT[period]));
  const value = events.map(event => event.value.toFixed(2));

  return { date, value };
};

module.exports = {
  allWidgets,
  getWidgetById,
  getWidget,
  createWidget,
  updateWidget,
  deleteWidget,
  allEventByWidget,
  createEvent,
}