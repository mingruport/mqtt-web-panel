const socketio = require('socket.io');
const logger = require('pino')();
const { Topic } = require('../models/topic');

let io;

const roundNuber = (value) => { // переименовать
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

const sendMessage = (topic, message) => {
  Topic.findByTopic(topic).then((topicData) => {
    const friendlyId = topicData.friendly.toLowerCase();
    const unit = topicData.unit;

    io.emit('update', {
      friendlyId,
      message: {
        value: roundNuber(message).toString(),
        unit,
      },
    });
  }).catch((err) => {
    logger.error(err);
  });
};

const updateTopics = () => {
  io.emit('update_topics');
};

module.exports = {
  listen,
  sendMessage,
  updateTopics,
};
