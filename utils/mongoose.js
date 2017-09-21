const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodbUIR, {
  useMongoClient: true,
});

module.exports = {
  mongoose,
};
