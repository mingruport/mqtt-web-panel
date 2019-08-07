const mongoose = require('mongoose');
const config = require('./../config');

const isDev = config.env !== 'production';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
if (isDev) mongoose.set('debug', true);

module.exports = mongoose.connect(config.mongodbUIR, { useNewUrlParser: true });
