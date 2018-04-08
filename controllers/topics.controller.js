const pick = require('lodash/pick');
const socketio = require('../utils/socketio');
const errors = require('../utils/errors');
const { mongoose } = require('../utils/mongoose');
const { Topic } = require('../models/topic.model');
const mqtt = require('../mqtt-client');

const getTopics = (req, res, next) => {
  Topic.find()
    .then((topics) => {
      res.json({ topics });
    })
    .catch(err => next(err));
};

const getTopic = (req, res, next) => {
  const { friendlyId } = req.params;

  Topic.findByFriendlyId(friendlyId)
    .then((topic) => {
      if (!topic) return Promise.reject(new errors.NotFoundError());
      res.json(topic);
    })
    .catch(err => next(err));
};

const addTopic = (req, res, next) => {
  if (!req.body) return Promise.reject(new errors.BadRequestError());

  const topic = new Topic(pick(req.body, Topic.publicFields));

  topic.save()
    .then((savedTopic) => {
      res.json(savedTopic);
      mqtt.subscribe(savedTopic.topic);
      socketio.updateTopics();
    })
    .catch(err => next(err));
};

const updateTopic = (req, res, next) => {
  const { friendlyId } = req.params;
  const body = pick(req.body, Topic.publicFields);

  Topic.findByFriendlyId(friendlyId)
    .then((topic) => {
      if (!topic) return Promise.reject(new errors.NotFoundError());

      return topic.set(body).save();
    })
    .then((updatedTopic) => {
      res.json(updatedTopic);
      mqtt.unsubscribe(updatedTopic.topic);
      mqtt.resubscribe();
      socketio.updateTopics();
    })
    .catch(err => next(err));
};

const deleteTopic = (req, res, next) => {
  const { friendlyId } = req.params;

  Topic.findByFriendlyId(friendlyId)
    .then((topic) => {
      if (!topic) return Promise.reject(new errors.NotFoundError());

      return topic.remove();
    })
    .then((deletedTopic) => {
      res.json(deletedTopic);
      mqtt.unsubscribe(deletedTopic.topic);
      socketio.updateTopics();
    })
    .catch(err => next(err));
};

module.exports = {
  getTopics,
  getTopic,
  addTopic,
  updateTopic,
  deleteTopic,
};
