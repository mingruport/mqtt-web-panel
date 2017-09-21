const express = require('express');
const httpStatus = require('http-status');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const logger = require('winston');
const config = require('./config');
const APIError = require('./utils/APIError');
const timeseries = require('./utils/timeseries');
const topicsRoutes = require('./routes/topics');
const timeseriesRoutes = require('./routes/timeseries');

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

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: err.stack,
  });
});

server.listen(config.port, () => {
  logger.info(`App listening on port ${config.port}.`);
});

module.exports = app;
