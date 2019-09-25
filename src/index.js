const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');

const mongoose = require('./utils/mongoose');
const mqtt = require('./mqtt');
const saveValue = require('./saveValue');
const { NotFoundError } = require('./utils/errors');
const widgetController = require('./controllers/widget.controller');
const socketHandler = require('./socket');
const logger = require('./utils/logger');
const config = require('./config');

const app = express();

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use(express.static('src/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use('/api/widgets', widgetController);

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
  .then(() => {
    const server = app.listen(config.port, () =>
      logger.info(`API server listening ${config.port} port.`)
    );

    socketio.listen(server).on('connection', socketHandler);

    saveValue();

    return mqtt.connectAndSubscribe();
  })
  .catch(err => logger.error(err));

module.exports = app;