const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

module.exports = mongoose.connect(config.mongodbUIR);
