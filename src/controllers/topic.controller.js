const express = require('express');
const Topic = require('../models/topic.model');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const pubsub = require('../utils/pubsub');

const router = express.Router();

/** GET api/topics - Get list of topics */
router.get('/', (req, res, next) => {
  Topic
    .find()
    .then(topics => res.json({ topics }))
    .catch(err => next(err));
});

/** GET api/topics/:friendlyId - Get topic */
router.get('/:friendlyId', (req, res, next) => {
  const { friendlyId } = req.params;

  Topic
    .findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new NotFoundError());
      res.json(topic);
    })
    .catch(err => next(err));
});

/** POST api/topics - Create new sensor */
router.post('/', (req, res, next) => {
  if (!req.body) return Promise.reject(new BadRequestError());

  const { friendly, topic, unit } = req.body;

  const newTopic = new Topic({ friendly, topic, unit });

  newTopic
    .save()
    .then(savedTopic => {
      pubsub.push('NEW_TOPIC', savedTopic.topic);
      res.json(savedTopic);
    })
    .catch(err => next(err));
});

/** PUT api/topics/:friendlyId - Update topic */
router.put('/:friendlyId', (req, res, next) => {
  const { friendlyId } = req.params;
  const body = req.body;

  Topic
    .findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new NotFoundError());
      return topic.set(body).save();
    })
    .then(updatedTopic => {
      pubsub.push('UPDATE_TOPIC', updatedTopic.topic);
      res.json(updatedTopic);
    })
    .catch(err => next(err));
});

/** DELETE api/topics/:friendlyId - Delete topic */
router.delete('/:friendlyId', (req, res, next) => {
  const { friendlyId } = req.params;

  Topic
    .findByFriendlyId(friendlyId)
    .then(topic => {
      if (!topic) return Promise.reject(new NotFoundError());
      return topic.remove();
    })
    .then(deletedTopic => {
      pubsub.push('DELETE_TOPIC', deletedTopic.topic);
      res.json(deletedTopic);
    })
    .catch(err => next(err));
});

module.exports = router;