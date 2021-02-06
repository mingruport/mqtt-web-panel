const pino = require('pino');
const pinoPretty = require('pino-pretty');

const config = require('../config');

const isProd = config.env === 'production';
const isDev = config.env === 'development';

const pinoOptions = {
  enabled: isDev || isProd,
  prettyPrint: isDev,
  prettifier: pinoPretty,
};

module.exports = pino(pinoOptions);
