const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const logger = require('pino')();

const config = require('./config');
const mqtt = require('./mqtt-client');
const saveLastValue = require('./utils/saveLastValue');
const errors = require('./utils/errors');
const timeseries = require('./utils/timeseries');
const topicsRoutes = require('./routes/topics.routes');
const timeseriesRoutes = require('./routes/timeseries.routes');

const app = express();
const server = require('http').createServer(app);
const io = require('./utils/socketio').listen(server);

app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use('/api/topics', topicsRoutes);
app.use('/api/timeseries', timeseriesRoutes);

timeseries.initBD();
mqtt.resubscribe();

app.use((req, res, next) => {
  const err = new errors.NotFoundError();
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

server.listen(config.port, () => {
  logger.info(`App listening on port ${config.port}.`);
});

module.exports = app;
