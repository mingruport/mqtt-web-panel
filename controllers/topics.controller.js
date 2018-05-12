const { mongoose } = require('../utils/mongoose');
const { Topic } = require('../models/topic.model');
const errors = require('../utils/errors');
const events = require('../events');

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.json({ topics });
    })
    .catch(err => next(err));
};

const getTopic = (req, res, next) => {
  const { friendlyId } = req.params;

  Topic.findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new errors.NotFoundError());
      res.json(topic);
    })
    .catch(err => next(err));
};

const addTopic = (req, res, next) => {
  if (!req.body) return Promise.reject(new errors.BadRequestError());

  const { friendly, topic, unit } = req.body;

  const newTopic = new Topic({ friendly, topic, unit });

  newTopic.save()
    .then(savedTopic => {
      events.push('NEW_TOPIC', savedTopic.topic);
      res.json(savedTopic);
    })
    .catch(err => next(err));
};

const updateTopic = (req, res, next) => {
  const { friendlyId } = req.params;
  const body = req.body;

  Topic.findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new errors.NotFoundError());

      return topic.set(body).save();
    })
    .then(updatedTopic => {
      events.push('UPDATE_TOPIC', updatedTopic.topic);
      res.json(updatedTopic);
    })
    .catch(err => next(err));
};

const deleteTopic = (req, res, next) => {
  const { friendlyId } = req.params;

  Topic.findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new errors.NotFoundError());

      return topic.remove();
    })
    .then(deletedTopic => {
      events.push('DELETE_TOPIC', deletedTopic.topic);
      res.json(deletedTopic);
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
