const httpStatus = require('http-status');
const pick = require('lodash/pick');
const socketio = require('../utils/socketio');
const APIError = require('../utils/APIError');
const {mongoose} = require('../utils/mongoose');
const {Topic} = require('../models/topic.model');
const mqtt = require('../mqtt-client');

const getTopics = (req, res, next) => {
  Topic.find().then((topics) => {
    res.json({ topics });
  }).catch(err => next(err));
}

function getTopic(req, res, next) {
  const { friendlyId } = req.params;

  Topic.findByFriendlyId(friendlyId).then((topic) => {
    if (!topic) {
      return next(new APIError('Not Found', httpStatus.NOT_FOUND, true));
    }
    res.json(topic);
  }).catch(err => next(err));
}

const addTopic = (req, res, next) => {
  if (!req.body) {
    return next(new APIError('Bad Request', httpStatus.BAD_REQUEST, true));
  }

  const topic = new Topic(pick(req.body, Topic.publicFields));

  topic.save().then((savedTopic) => {
    res.json(savedTopic);
    mqtt.subscribe(savedTopic.topic);
    socketio.updateTopics();
  }).catch((err) => {
    next(err);
  });
}

const updateTopic = (req, res, next) => {
  const { friendlyId } = req.params;
  const topic = pick(req.body, Topic.publicFields);

  Topic.findByFriendlyIdAndUpdate(friendlyId, topic).then((updatedTopic) => {
    if (!updatedTopic) {
      return next(new APIError('Not Found', httpStatus.NOT_FOUND, true));
    }
    res.json(updatedTopic);
    mqtt.unsubscribe(updatedTopic.topic);
    mqtt.resubscribe();
    socketio.updateTopics();
  }).catch(err => next(err));
}

const deleteTopic = (req, res, next) => {
  const { friendlyId } = req.params;

  Topic.findByFriendlyIdAndRemove(friendlyId).then((deletedTopic) => {
    if (!deletedTopic) {
      return next(new APIError('Not Found', httpStatus.NOT_FOUND, true));
    }
    res.json(deletedTopic);
    mqtt.unsubscribe(deletedTopic.topic);
    socketio.updateTopics();
  }).catch(err => next(err));
}

module.exports = {
  getTopics,
  getTopic,
  addTopic,
  updateTopic,
  deleteTopic
};
