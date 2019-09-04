const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const morgan = require('morgan');

const mongoose = require('./utils/mongoose');
const mqtt = require('./mqtt-client');
const saveLastValue = require('./utils/saveLastValue');
const { NotFoundError } = require('./utils/errors');
const timeseries = require('./utils/timeseries');
const topicController = require('./controllers/topic.controller');
const timeseriesController = require('./controllers/timeseries.controller');
const logger = require('./utils/logger');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const io = require('./utils/socketio').listen(server);

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());

app.use(express.static('src/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use('/api/topics', topicController);
app.use('/api/timeseries', timeseriesController);

timeseries.initBD();
mqtt.resubscribe();

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || [];

  res.status(status).json({ status, message, details });
});

mongoose
  .then(() => server.listen(config.port, () =>
    logger.info(`API server listening ${config.port} port.`)
  ))
  .catch(err => logger.error(err));

module.exports = app;
