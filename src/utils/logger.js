const pino = require('pino');

const config = require('../config');

const isProd = config.env === 'production';
const isDev = config.env === 'development';

const pinoOptions = {
  enabled: isDev || isProd,
  prettyPrint: isDev,
};

module.exports = pino(pinoOptions);
