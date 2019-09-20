const mongoose = require('mongoose');
const handleMongooseError = require('../utils/mongooseError');

const TopicSchema = mongoose.Schema({
  friendly: {
    type: String,
    required: [true, 'can\'t be blank'],
    unique: true,
    trim: true,
  },
  topic: {
    type: String,
    required: [true, 'can\'t be blank'],
    unique: true,
    trim: true,
  },
  unit: {
    type: String,
    trim: true,
  },
  lastValue: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

TopicSchema.post('save', handleMongooseError);

TopicSchema.methods.toJSON = function () {
  return {
    friendlyId: this.friendly.toLocaleLowerCase(),
    friendly: this.friendly,
    topic: this.topic,
    unit: this.unit,
    value: this.lastValue,
  };
};

TopicSchema.statics.findByTopic = function (topic) {
  const Topic = this;
  const query = { topic };

  return Topic.findOne(query);
};

TopicSchema.statics.findByFriendlyId = function (friendlyId) {
  const Topic = this;
  const query = { friendly: { $regex: new RegExp(`^${friendlyId.toLowerCase()}`, 'i') } };

  return Topic.findOne(query);
};

module.exports = mongoose.model('Topic', TopicSchema);