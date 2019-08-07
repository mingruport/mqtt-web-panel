const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

module.exports = mongoose.connect(config.mongodbUIR, { useNewUrlParser: true });
