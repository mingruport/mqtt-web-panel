const socketio = require('socket.io');
const logger = require('pino')();
const { Topic } = require('../models/topic.model');
const inputStream = require('../data-streams/input');

let io;

const roundNuber = (value) => {
  if (isFinite(value)) {
    return Number(value);
  }
  return value;
};

const listen = (app) => {
  io = socketio.listen(app);

  io.on('connection', () => {
    logger.info('socket.io', 'Client connected.');
  });

  return io;
};

inputStream.subscribe('message', (topic, value) => {
  Topic.findByTopic(topic).then((topicData) => {
    const friendlyId = topicData.friendly.toLowerCase();
    const unit = topicData.unit;

    io.emit('update', {
      friendlyId,
      message: {
        value: roundNuber(value).toString(),
        unit,
      },
    });
  }).catch((err) => {
    logger.error(err);
  });
});

const updateTopics = () => {
  io.emit('update_topics');
};

module.exports = {
  listen,
  updateTopics,
};
