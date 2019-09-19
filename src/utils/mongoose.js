const mongoose = require('mongoose');
const config = require('./../config');

const isDev = config.env !== 'production';

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
if (isDev) mongoose.set('debug', true);

module.exports = mongoose.connect(config.mongodbUIR);
