const socketio = require('socket.io');
const Topic = require('../models/topic.model');
const pubsub = require('../utils/pubsub');
const logger = require('../utils/logger');

let io;

const roundNuber = (value) => {
  if (isFinite(value)) {
    return Number(value);
  }
  return value;
};

const listen = (app) => {
  io = socketio.listen(app);

  io.on('connection', () => logger.info('socket.io', 'Client connected.'));

  return io;
};

pubsub.subscribe('MESSAGE', (topic, value) => {
  Topic
    .findByTopic(topic)
    .then(topicData => {
      const friendlyId = topicData.friendly.toLowerCase();
      const message = { value: roundNuber(value).toString(), unit: topicData.unit };

      io.emit('update', { friendlyId, message });
    })
    .catch(err => logger.error(err));
});

pubsub.subscribe('NEW_TOPIC', () => io.emit('update_topics'));

pubsub.subscribe('UPDATE_TOPIC', () => io.emit('update_topics'));

pubsub.subscribe('DELETE_TOPIC', () => io.emit('update_topics'));

module.exports = {
  listen
};
