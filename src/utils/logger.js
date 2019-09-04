const pino = require('pino');
const config = require('../config');

const isDev = config.env !== 'production';

const pinoOptions = isDev ? {
    prettyPrint: {
        translateTime: 'HH:MM:ss.l'
    }
} : {};

module.exports = pino(pinoOptions);;