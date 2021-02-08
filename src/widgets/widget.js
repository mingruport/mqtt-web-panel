const mongoose = require('mongoose');
const handleMongooseError = require('../utils/mongooseError');

const WidgetSchema = mongoose.Schema({
  name: {
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
  qos: {
    type: Number,
    default: 0,
    min: 0,
    max: 2
  },
  unit: {
    type: String,
    trim: true,
  },
  value: {
    type: String,
    trim: true,
  },
}, { 
  timestamps: true,
  versionKey: false,
});

WidgetSchema.post('save', handleMongooseError);

WidgetSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    topic: this.topic,
    qos: this.qos,
    unit: this.unit,
    value: this.value,
  };
};

module.exports = mongoose.model('Widget', WidgetSchema);